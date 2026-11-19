#!/usr/bin/env python3
"""
Offline TTS & Word-Level Timestamp Generator for `about.intro`.

Uses `edge-tts` (LGPL-3.0, https://github.com/rany2/edge-tts) with explicit
`boundary="WordBoundary"` to synthesize static `.mp3` files and aligned
character-offset word timestamps in `public/audio/about/`.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import subprocess
import sys
import unicodedata
from pathlib import Path
from typing import Any, TypedDict

try:
    import edge_tts
except ImportError as exc:
    print(
        "[tts:generate] ERROR: Missing Python package 'edge-tts'. "
        "Install it with: python -m pip install edge-tts",
        file=sys.stderr,
    )
    raise SystemExit(1) from exc

TICKS_PER_SECOND = 10_000_000
MP3_BITRATE_BPS = 48_000

DEFAULT_VOICES: dict[str, str] = {
    "en": "en-US-GuyNeural",
    "vi": "vi-VN-NamMinhNeural",
}

CHAR_FOLD_MAP = str.maketrans(
    {
        "\u2018": "'",
        "\u2019": "'",
        "\u02bc": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2013": "-",
        "\u2014": "-",
    }
)


class RawWordBoundary(TypedDict):
    text: str
    start: float
    end: float


class AlignedWord(TypedDict):
    text: str
    start: float
    end: float
    charStart: int
    charEnd: int


class AlignmentError(RuntimeError):
    """Raised when WordBoundary tokens cannot be strictly aligned to source text."""


def normalize_char_1to1(text: str) -> str:
    """Normalize typographic quotes/dashes and case while preserving 1-to-1 string length."""
    folded = text.translate(CHAR_FOLD_MAP).lower()
    if len(folded) != len(text):
        raise AlignmentError("1-to-1 normalization changed string length.")
    return folded


def contains_word_chars(segment: str) -> bool:
    """Return True if segment contains any letter or number character."""
    for ch in segment:
        cat = unicodedata.category(ch)
        if cat.startswith(("L", "N")):
            return True
    return False


def align_words_to_source(
    source_text: str, raw_words: list[RawWordBoundary], lang: str
) -> list[AlignedWord]:
    """
    Strictly map each WordBoundary token back to (charStart, charEnd) in source_text.
    Raises AlignmentError if any word cannot be matched or if any source word is skipped.
    """
    norm_source = normalize_char_1to1(source_text)
    cursor = 0
    aligned: list[AlignedWord] = []

    for idx, raw in enumerate(raw_words):
        token = unicodedata.normalize("NFC", raw["text"].strip())
        if not token:
            continue

        norm_token = normalize_char_1to1(token)
        match_pos = norm_source.find(norm_token, cursor)

        # Edge-TTS occasionally attaches or strips trailing punctuation on tokens
        if match_pos == -1 or contains_word_chars(source_text[cursor:match_pos]):
            stripped_token = token.strip(".,!?;:\"'()[]{}")
            if stripped_token:
                norm_stripped = normalize_char_1to1(stripped_token)
                alt_pos = norm_source.find(norm_stripped, cursor)
                if alt_pos != -1 and not contains_word_chars(
                    source_text[cursor:alt_pos]
                ):
                    match_pos = alt_pos
                    norm_token = norm_stripped

        if match_pos == -1:
            context_snippet = source_text[cursor : min(len(source_text), cursor + 80)]
            raise AlignmentError(
                f"[{lang}] Word #{idx} {raw['text']!r} not found in source text "
                f"starting at index {cursor}. Remaining snippet: {context_snippet!r}"
            )

        skipped = source_text[cursor:match_pos]
        if contains_word_chars(skipped):
            raise AlignmentError(
                f"[{lang}] Alignment skipped source word characters {skipped!r} "
                f"between index {cursor} and {match_pos} before word #{idx} ({raw['text']!r})."
            )

        char_start = match_pos
        char_end = match_pos + len(norm_token)
        exact_source_slice = source_text[char_start:char_end]

        aligned.append(
            {
                "text": exact_source_slice,
                "start": raw["start"],
                "end": raw["end"],
                "charStart": char_start,
                "charEnd": char_end,
            }
        )
        cursor = char_end

    trailing = source_text[cursor:]
    if contains_word_chars(trailing):
        raise AlignmentError(
            f"[{lang}] Unaligned trailing word characters at end of source text "
            f"(from index {cursor}): {trailing!r}"
        )

    return aligned


async def synthesize_language(
    lang: str,
    full_text: str,
    expected_hash: str,
    voice: str,
    out_dir: Path,
) -> dict[str, Any]:
    computed_hash = hashlib.sha256(full_text.encode("utf-8")).hexdigest()
    if computed_hash != expected_hash:
        raise RuntimeError(
            f"[{lang}] SHA-256 mismatch between extractor ({expected_hash}) "
            f"and Python ({computed_hash})."
        )

    audio_chunks = bytearray()
    raw_words: list[RawWordBoundary] = []
    last_exc: Exception | None = None

    for attempt in range(1, 4):
        audio_chunks.clear()
        raw_words.clear()
        communicate = edge_tts.Communicate(
            text=full_text,
            voice=voice,
            boundary="WordBoundary",
        )
        try:
            async for chunk in communicate.stream():
                chunk_type = chunk.get("type")
                if chunk_type == "audio":
                    data = chunk.get("data")
                    if isinstance(data, (bytes, bytearray)):
                        audio_chunks.extend(data)
                elif chunk_type == "WordBoundary":
                    offset_ticks = int(chunk["offset"])
                    duration_ticks = int(chunk["duration"])
                    start_sec = round(offset_ticks / TICKS_PER_SECOND, 4)
                    end_sec = round(
                        (offset_ticks + duration_ticks) / TICKS_PER_SECOND, 4
                    )
                    raw_words.append(
                        {
                            "text": str(chunk["text"]),
                            "start": start_sec,
                            "end": max(end_sec, round(start_sec + 0.01, 4)),
                        }
                    )
            if audio_chunks and raw_words:
                last_exc = None
                break
        except Exception as exc:
            last_exc = exc
            if attempt < 3:
                await asyncio.sleep(1.0 * attempt)

    if last_exc is not None and not audio_chunks:
        raise last_exc

    if not audio_chunks:
        raise RuntimeError(f"[{lang}] No audio bytes received from edge-tts.")
    if not raw_words:
        raise RuntimeError(
            f"[{lang}] No WordBoundary events received from edge-tts "
            "(ensure boundary='WordBoundary' is supported by voice)."
        )

    aligned_words = align_words_to_source(full_text, raw_words, lang)

    cbr_duration = (len(audio_chunks) * 8) / MP3_BITRATE_BPS
    last_word_end = aligned_words[-1]["end"] if aligned_words else 0.0
    duration = round(max(cbr_duration, last_word_end), 3)

    out_dir.mkdir(parents=True, exist_ok=True)
    mp3_path = out_dir / f"intro.{lang}.mp3"
    json_path = out_dir / f"intro.{lang}.json"

    mp3_path.write_bytes(bytes(audio_chunks))

    manifest = {
        "lang": lang,
        "voice": voice,
        "textHash": computed_hash,
        "duration": duration,
        "words": aligned_words,
    }
    json_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    size_kb = len(audio_chunks) / 1024
    print(
        f"[tts:generate] [{lang}] Voice={voice} | Words={len(aligned_words)} | "
        f"Duration={duration:.2f}s | Size={size_kb:.1f}KB -> {mp3_path.name}, {json_path.name}"
    )
    return manifest


async def async_main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate static MP3 and word-level timestamps for about.intro."
    )
    parser.add_argument(
        "--en-voice",
        default=DEFAULT_VOICES["en"],
        help=f"Edge-TTS voice for English (default: {DEFAULT_VOICES['en']})",
    )
    parser.add_argument(
        "--vi-voice",
        default=DEFAULT_VOICES["vi"],
        help=f"Edge-TTS voice for Vietnamese (default: {DEFAULT_VOICES['vi']})",
    )
    parser.add_argument(
        "--skip-extract",
        action="store_true",
        help="Skip running extract-text.ts before generating audio",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent.parent
    extract_script = script_dir / "extract-text.ts"
    input_json_path = script_dir / ".cache" / "intro-input.json"
    out_dir = repo_root / "public" / "audio" / "about"

    if not args.skip_extract:
        subprocess.run(
            ["node", str(extract_script)],
            cwd=str(repo_root),
            check=True,
        )

    if not input_json_path.exists():
        raise FileNotFoundError(
            f"Missing extracted text file at {input_json_path}. Run extract-text.ts first."
        )

    payload = json.loads(input_json_path.read_text(encoding="utf-8"))
    items = payload["items"]

    voices = {
        "en": args.en_voice,
        "vi": args.vi_voice,
    }

    for lang in ("en", "vi"):
        item = items[lang]
        await synthesize_language(
            lang=lang,
            full_text=item["fullText"],
            expected_hash=item["textHash"],
            voice=voices[lang],
            out_dir=out_dir,
        )

    return 0


def main() -> None:
    try:
        raise SystemExit(asyncio.run(async_main()))
    except Exception as exc:
        print(f"[tts:generate] ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()

