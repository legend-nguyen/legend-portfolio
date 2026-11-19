"use client";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  Language,
  getTranslations,
  isLanguage,
  translate,
  type TranslationDictionary,
  type TranslationKey,
  type TranslationParams,
} from "@/shared/i18n";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const LANGUAGE_CHANGE_EVENT = "legend-language-change";

function subscribeToLanguage(callback: () => void): () => void {
  const handleStorage = (event: StorageEvent): void => {
    if (event.key === null || event.key === LANGUAGE_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
}

function getLanguageSnapshot(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function getLanguageServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

export type LanguageContextValue = {
  language: Language;
  setLanguage: (nextLanguage: Language) => void;
  dictionary: TranslationDictionary;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language): void => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // Ignore storage quota or private-mode errors
    }
    document.documentElement.lang = nextLanguage;
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string =>
      translate(language, key, params),
    [language]
  );

  const dictionary = useMemo(() => getTranslations(language), [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      dictionary,
      t,
    }),
    [language, setLanguage, dictionary, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context !== null) {
    return context;
  }

  return {
    language: DEFAULT_LANGUAGE,
    setLanguage: () => {},
    dictionary: getTranslations(DEFAULT_LANGUAGE),
    t: (key: TranslationKey, params?: TranslationParams): string =>
      translate(DEFAULT_LANGUAGE, key, params),
  };
}

