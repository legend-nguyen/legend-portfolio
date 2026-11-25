import {
  buildAboutIntroFromDictionary,
  buildAboutIntroFromTranslator,
  sha256Hex,
  type AboutIntroDocument,
  type IntroBlock,
  type IntroSegment,
  type IntroSegmentKind,
} from "./about-intro-text";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  Language,
  isLanguage,
  type LanguageOption,
} from "./language";
import {
  TRANSLATION_KEYS,
  type TranslationDictionary,
  type TranslationKey,
} from "./translation-keys";
import { langEn } from "./translates/lang-en";
import { langVn } from "./translates/lang-vn";

const DICTIONARIES: Record<Language, TranslationDictionary> = {
  [Language.EN]: langEn,
  [Language.VI]: langVn,
};

export type TranslationParams = Record<string, string | number>;

export function getTranslations(
  language: Language = DEFAULT_LANGUAGE
): TranslationDictionary {
  return DICTIONARIES[language] ?? DICTIONARIES[DEFAULT_LANGUAGE];
}

function resolveKey(
  dictionary: TranslationDictionary,
  key: TranslationKey
): string {
  const segments = key.split(".");
  let current: unknown = dictionary;

  for (const segment of segments) {
    if (typeof current === "object" && current !== null && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return key;
    }
  }

  return typeof current === "string" ? current : key;
}

export function translate(
  language: Language,
  key: TranslationKey,
  params?: TranslationParams
): string {
  const dictionary = getTranslations(language);
  const template = resolveKey(dictionary, key);

  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
    return acc.replaceAll(`{${paramKey}}`, String(paramValue));
  }, template);
}

export {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  Language,
  TRANSLATION_KEYS,
  buildAboutIntroFromDictionary,
  buildAboutIntroFromTranslator,
  isLanguage,
  sha256Hex,
};
export type {
  AboutIntroDocument,
  IntroBlock,
  IntroSegment,
  IntroSegmentKind,
  LanguageOption,
  TranslationDictionary,
  TranslationKey,
};
