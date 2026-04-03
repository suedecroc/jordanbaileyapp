"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { Locale } from "@/lib/site";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "jb-locale";
const STORAGE_EVENT = "jb-locale-change";

function getSnapshot(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "de" ? stored : "en";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const callback = () => onStoreChange();

  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribe, getSnapshot, () => "en");

  const value: LanguageContextValue = {
    locale,
    setLocale(nextLocale: Locale) {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, nextLocale);
      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
