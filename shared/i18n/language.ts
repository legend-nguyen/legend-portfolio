export enum Language {
  EN = "en",
  VI = "vi",
}

export const DEFAULT_LANGUAGE: Language = Language.EN;

export const LANGUAGE_STORAGE_KEY = "legend-portfolio-language";

export type LanguageOption = {
  readonly value: Language;
  readonly label: string;
  readonly nativeName: string;
};

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    value: Language.EN,
    label: "EN",
    nativeName: "English",
  },
  {
    value: Language.VI,
    label: "VIE",
    nativeName: "Tiếng Việt",
  },
] as const;

export function isLanguage(value: unknown): value is Language {
  return value === Language.EN || value === Language.VI;
}
