import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAboutIntroFromDictionary } from "../../shared/i18n/about-intro-text.ts";
import { langEn } from "../../shared/i18n/translates/lang-en.ts";
import { langVn } from "../../shared/i18n/translates/lang-vn.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, ".cache", "intro-input.json");

const enDoc = buildAboutIntroFromDictionary(langEn);
const viDoc = buildAboutIntroFromDictionary(langVn);

const payload = {
  generatedAt: new Date().toISOString(),
  items: {
    en: {
      lang: "en",
      fullText: enDoc.fullText,
      textHash: enDoc.textHash,
    },
    vi: {
      lang: "vi",
      fullText: viDoc.fullText,
      textHash: viDoc.textHash,
    },
  },
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(
  `[tts:extract] Wrote canonical about.intro text (en=${enDoc.fullText.length} chars, vi=${viDoc.fullText.length} chars) -> ${outputPath}`
);

