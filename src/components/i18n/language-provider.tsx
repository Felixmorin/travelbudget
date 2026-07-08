"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

import { Language, languages, translations } from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const storageKey = "travelbudget-language";
const languageChangeEvent = "travelbudget-language-change";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribeToLanguage, getLanguageSnapshot, getServerLanguageSnapshot);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useTranslation must be used inside LanguageProvider");
  }

  return context;
}

function isLanguage(value: string | null): value is Language {
  return languages.some((language) => language === value);
}

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(languageChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(languageChangeEvent, onStoreChange);
  };
}

function getLanguageSnapshot(): Language {
  const storedLanguage = window.localStorage.getItem(storageKey);
  return isLanguage(storedLanguage) ? storedLanguage : "en";
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

function setLanguage(language: Language) {
  window.localStorage.setItem(storageKey, language);
  window.dispatchEvent(new Event(languageChangeEvent));
}
