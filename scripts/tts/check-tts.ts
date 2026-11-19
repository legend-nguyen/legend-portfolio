import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAboutIntroFromDictionary } from "../../shared/i18n/about-intro-text.ts";
import { langEn } from "../../shared/i18n/translates/lang-en.ts";
import { langVn } from "../../shared/i18n/translates/lang-vn.ts";

type TtsWordEntry = {
  text: string;
  start: number;
  end: number;
  charStart: number;
  charEnd: number;
};

type TtsManifest = {
  lang: string;
  voice: string;
  textHash: string;
  duration: number;
  words: TtsWordEntry[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..");
const audioDir = resolve(repoRoot, "public", "audio", "about");

const expectedDocs = {
  en: buildAboutIntroFromDictionary(langEn),
  vi: buildAboutIntroFromDictionary(langVn),
} as const;

let hasError = false;

for (const lang of ["en", "vi"] as const) {
  const expected = expectedDocs[lang];
  const mp3Path = resolve(audioDir, `intro.${lang}.mp3`);
  const jsonPath = resolve(audioDir, `intro.${lang}.json`);

  if (!existsSync(mp3Path)) {
    console.error(
      `[tts:check] ERROR [${lang}]: Missing audio file at ${mp3Path}. Run "npm run tts:generate".`
    );
    hasError = true;
    continue;
  }

  const mp3Stat = statSync(mp3Path);
  if (mp3Stat.size === 0) {
    console.error(
      `[tts:check] ERROR [${lang}]: Audio file ${mp3Path} is empty (0 bytes).`
    );
    hasError = true;
  }

  if (!existsSync(jsonPath)) {
    console.error(
      `[tts:check] ERROR [${lang}]: Missing timestamp JSON at ${jsonPath}. Run "npm run tts:generate".`
    );
    hasError = true;
    continue;
  }

  let manifest: TtsManifest;
  try {
    manifest = JSON.parse(readFileSync(jsonPath, "utf8")) as TtsManifest;
  } catch (err) {
    console.error(
      `[tts:check] ERROR [${lang}]: Invalid JSON in ${jsonPath}:`,
      err
    );
    hasError = true;
    continue;
  }

  if (manifest.textHash !== expected.textHash) {
    console.error(
      `[tts:check] ERROR [${lang}]: Content of "about.intro" has changed since audio was generated!\n` +
        `  Expected textHash: ${expected.textHash}\n` +
        `  JSON textHash:     ${manifest.textHash}\n` +
        `  -> Run "npm run tts:generate" to regenerate audio and word timestamps.`
    );
    hasError = true;
    continue;
  }

  if (!Array.isArray(manifest.words) || manifest.words.length === 0) {
    console.error(
      `[tts:check] ERROR [${lang}]: "words" array in ${jsonPath} is empty.`
    );
    hasError = true;
    continue;
  }

  let prevCharEnd = 0;
  for (let i = 0; i < manifest.words.length; i += 1) {
    const word = manifest.words[i];
    if (!word) {
      continue;
    }
    if (
      typeof word.charStart !== "number" ||
      typeof word.charEnd !== "number" ||
      word.charStart < prevCharEnd ||
      word.charEnd <= word.charStart ||
      word.charEnd > expected.fullText.length
    ) {
      console.error(
        `[tts:check] ERROR [${lang}]: Invalid char range [${word.charStart}, ${word.charEnd}] at word #${i} (${JSON.stringify(word.text)}).`
      );
      hasError = true;
      break;
    }

    const actualSlice = expected.fullText.slice(word.charStart, word.charEnd);
    if (actualSlice !== word.text) {
      console.error(
        `[tts:check] ERROR [${lang}]: Word #${i} text mismatch: JSON has ${JSON.stringify(word.text)}, source slice has ${JSON.stringify(actualSlice)}.`
      );
      hasError = true;
      break;
    }

    prevCharEnd = word.charEnd;
  }

  if (!hasError) {
    console.log(
      `[tts:check] OK [${lang}]: hash=${manifest.textHash.slice(0, 12)}... | words=${manifest.words.length} | duration=${manifest.duration}s | mp3=${(mp3Stat.size / 1024).toFixed(1)}KB`
    );
  }
}

if (hasError) {
  process.exit(1);
}
