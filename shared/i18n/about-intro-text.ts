import type {
  TranslationDictionary,
  TranslationKey,
} from "./translation-keys";

export type IntroSegmentKind = "plain" | "underline" | "strong";

export type IntroSegment = {
  id: string;
  text: string;
  kind: IntroSegmentKind;
  charStart: number;
  charEnd: number;
};

export type IntroBlock = {
  id: "heading" | "p1" | "p2" | "p3";
  tag: "h1" | "p";
  segments: IntroSegment[];
  charStart: number;
  charEnd: number;
};

export type AboutIntroDocument = {
  fullText: string;
  textHash: string;
  blocks: IntroBlock[];
};

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}

/**
 * Computes lowercase hex SHA-256 digest of a UTF-8 string synchronously.
 * Matches Python `hashlib.sha256(text.encode("utf-8")).hexdigest()`.
 */
export function sha256Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const bitLenHi = Math.floor((bytes.length * 8) / 0x100000000);
  const bitLenLo = (bytes.length * 8) >>> 0;

  const paddedLength = (((bytes.length + 9 + 63) >> 6) << 6);
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[bytes.length] = 0x80;

  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLenHi, false);
  view.setUint32(paddedLength - 4, bitLenLo, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i += 1) {
      const w15 = w[i - 15] ?? 0;
      const w2 = w[i - 2] ?? 0;
      const w16 = w[i - 16] ?? 0;
      const w7 = w[i - 7] ?? 0;
      const s0 = rotr(w15, 7) ^ rotr(w15, 18) ^ (w15 >>> 3);
      const s1 = rotr(w2, 17) ^ rotr(w2, 19) ^ (w2 >>> 10);
      w[i] = (w16 + s0 + w7 + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i += 1) {
      const kVal = SHA256_K[i] ?? 0;
      const wVal = w[i] ?? 0;
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + kVal + wVal) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
}

type RawBlockSpec = {
  id: IntroBlock["id"];
  tag: IntroBlock["tag"];
  segments: Array<{
    id: string;
    text: string;
    kind: IntroSegmentKind;
  }>;
};

function assembleBlocks(rawBlocks: RawBlockSpec[]): AboutIntroDocument {
  const blocks: IntroBlock[] = [];
  let cursor = 0;
  const blockTexts: string[] = [];

  for (let bIdx = 0; bIdx < rawBlocks.length; bIdx += 1) {
    const rawBlock = rawBlocks[bIdx];
    if (!rawBlock) {
      continue;
    }
    if (bIdx > 0) {
      cursor += 2; // "\n\n" separator between blocks
    }
    const blockStart = cursor;
    const segments: IntroSegment[] = [];
    let blockText = "";

    for (const seg of rawBlock.segments) {
      const charStart = cursor;
      const charEnd = charStart + seg.text.length;
      segments.push({
        id: seg.id,
        text: seg.text,
        kind: seg.kind,
        charStart,
        charEnd,
      });
      blockText += seg.text;
      cursor = charEnd;
    }

    blocks.push({
      id: rawBlock.id,
      tag: rawBlock.tag,
      segments,
      charStart: blockStart,
      charEnd: cursor,
    });
    blockTexts.push(blockText);
  }

  const fullText = blockTexts.join("\n\n");
  return {
    fullText,
    textHash: sha256Hex(fullText),
    blocks,
  };
}

export function buildAboutIntroFromTranslator(
  t: (key: TranslationKey) => string
): AboutIntroDocument {
  return assembleBlocks([
    {
      id: "heading",
      tag: "h1",
      segments: [
        {
          id: "greetingPrefix",
          text: t("about.intro.greetingPrefix"),
          kind: "plain",
        },
        { id: "name", text: t("about.intro.name"), kind: "underline" },
        { id: "headingPeriod", text: ".", kind: "plain" },
      ],
    },
    {
      id: "p1",
      tag: "p",
      segments: [
        { id: "p1Part1", text: t("about.intro.p1Part1"), kind: "plain" },
        {
          id: "p1Highlight1",
          text: t("about.intro.p1Highlight1"),
          kind: "strong",
        },
        { id: "p1Part2", text: t("about.intro.p1Part2"), kind: "plain" },
        {
          id: "p1Highlight2",
          text: t("about.intro.p1Highlight2"),
          kind: "strong",
        },
        { id: "p1Part3", text: t("about.intro.p1Part3"), kind: "plain" },
        {
          id: "p1Highlight3",
          text: t("about.intro.p1Highlight3"),
          kind: "strong",
        },
        { id: "p1Part4", text: t("about.intro.p1Part4"), kind: "plain" },
      ],
    },
    {
      id: "p2",
      tag: "p",
      segments: [
        { id: "p2Part1", text: t("about.intro.p2Part1"), kind: "plain" },
        {
          id: "p2Highlight1",
          text: t("about.intro.p2Highlight1"),
          kind: "strong",
        },
        { id: "p2Part2", text: t("about.intro.p2Part2"), kind: "plain" },
      ],
    },
    {
      id: "p3",
      tag: "p",
      segments: [
        { id: "p3Part1", text: t("about.intro.p3Part1"), kind: "plain" },
        {
          id: "p3Highlight1",
          text: t("about.intro.p3Highlight1"),
          kind: "strong",
        },
        { id: "p3Part2", text: t("about.intro.p3Part2"), kind: "plain" },
        {
          id: "p3Highlight2",
          text: t("about.intro.p3Highlight2"),
          kind: "strong",
        },
        { id: "p3Part3", text: t("about.intro.p3Part3"), kind: "plain" },
      ],
    },
  ]);
}

export function buildAboutIntroFromDictionary(
  dictionary: TranslationDictionary
): AboutIntroDocument {
  const intro = dictionary.about.intro;
  return assembleBlocks([
    {
      id: "heading",
      tag: "h1",
      segments: [
        { id: "greetingPrefix", text: intro.greetingPrefix, kind: "plain" },
        { id: "name", text: intro.name, kind: "underline" },
        { id: "headingPeriod", text: ".", kind: "plain" },
      ],
    },
    {
      id: "p1",
      tag: "p",
      segments: [
        { id: "p1Part1", text: intro.p1Part1, kind: "plain" },
        { id: "p1Highlight1", text: intro.p1Highlight1, kind: "strong" },
        { id: "p1Part2", text: intro.p1Part2, kind: "plain" },
        { id: "p1Highlight2", text: intro.p1Highlight2, kind: "strong" },
        { id: "p1Part3", text: intro.p1Part3, kind: "plain" },
        { id: "p1Highlight3", text: intro.p1Highlight3, kind: "strong" },
        { id: "p1Part4", text: intro.p1Part4, kind: "plain" },
      ],
    },
    {
      id: "p2",
      tag: "p",
      segments: [
        { id: "p2Part1", text: intro.p2Part1, kind: "plain" },
        { id: "p2Highlight1", text: intro.p2Highlight1, kind: "strong" },
        { id: "p2Part2", text: intro.p2Part2, kind: "plain" },
      ],
    },
    {
      id: "p3",
      tag: "p",
      segments: [
        { id: "p3Part1", text: intro.p3Part1, kind: "plain" },
        { id: "p3Highlight1", text: intro.p3Highlight1, kind: "strong" },
        { id: "p3Part2", text: intro.p3Part2, kind: "plain" },
        { id: "p3Highlight2", text: intro.p3Highlight2, kind: "strong" },
        { id: "p3Part3", text: intro.p3Part3, kind: "plain" },
      ],
    },
  ]);
}
