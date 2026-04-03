"use client";

import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn(
        "panel-soft inline-flex items-center rounded-full p-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted",
        className,
      )}
      aria-label="Language switcher"
      role="group"
    >
      {(["en", "de"] as const).map((option) => {
        const active = locale === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLocale(option)}
            className={cn(
              "rounded-full px-3 py-2",
              active
                ? "bg-[rgba(240,213,168,0.16)] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-muted hover:text-foreground",
            )}
            aria-pressed={active}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
