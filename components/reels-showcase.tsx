"use client";

import { useMemo, useState, useTransition } from "react";

import { useLanguage } from "@/components/language-provider";
import { ReelPlayer } from "@/components/reel-player";
import { reelsShowcaseCopy } from "@/lib/home";
import { getLocalizedText, reels } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ReelsShowcase({
  mode = "home",
  stacked = false,
}: {
  mode?: "home" | "page";
  stacked?: boolean;
}) {
  const { locale } = useLanguage();
  const [activeId, setActiveId] = useState(
    reels.find((reel) => reel.featured)?.id ?? reels[0]?.id ?? "cinematic",
  );
  const [isPending, transition] = useTransition();

  const activeReel = useMemo(
    () => reels.find((reel) => reel.id === activeId) ?? reels[0],
    [activeId],
  );

  if (!activeReel) {
    return null;
  }

  const eyebrow = getLocalizedText(
    mode === "home" ? reelsShowcaseCopy.homeEyebrow : reelsShowcaseCopy.pageEyebrow,
    locale,
  );
  const title = getLocalizedText(
    mode === "home" ? reelsShowcaseCopy.homeTitle : reelsShowcaseCopy.pageTitle,
    locale,
  );
  const description = getLocalizedText(
    mode === "home"
      ? reelsShowcaseCopy.homeDescription
      : reelsShowcaseCopy.pageDescription,
    locale,
  );

  return (
    <div
      id={mode === "home" ? "featured-reel" : undefined}
      className={cn(
        "grid gap-5",
        stacked
          ? "grid-cols-1"
          : mode === "page"
            ? "xl:grid-cols-[minmax(0,0.9fr)_minmax(300px,0.42fr)] xl:items-start"
            : "2xl:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.45fr)] 2xl:items-start",
      )}
    >
      <div
        className={cn(
          mode === "page" ? "listening-stage__feature" : "sheet-card",
          "rounded-[1.2rem] p-5 sm:p-6",
        )}
      >
        <p className={cn("cue-label", mode === "page" && "cue-label--stage")}>{eyebrow}</p>
        <h2
          className={cn(
            "mt-4 font-serif text-[2.45rem] leading-[0.92] tracking-[0.01em] sm:text-[3rem]",
            mode === "page" ? "text-[var(--ink-surface-text)]" : "text-foreground",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-7",
            mode === "page" ? "text-[rgba(247,241,231,0.76)]" : "text-muted",
          )}
        >
          {description}
        </p>

        <div className="mt-6">
          <ReelPlayer key={activeReel.id} reel={activeReel} compact={mode === "home"} />
        </div>
      </div>

      <div className="grid gap-4">
        <div className={cn(mode === "page" ? "paper-panel" : "panel-soft", "rounded-[1.5rem] p-4")}>
          <div className="flex flex-wrap gap-2.5">
            {reels.map((reel) => {
              const active = reel.id === activeId;
              return (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => transition(() => setActiveId(reel.id))}
                  className={cn(
                    "lane-tab",
                    active ? "lane-tab--active" : "text-muted hover:text-foreground",
                  )}
                  aria-pressed={active}
                >
                  {getLocalizedText(reel.label, locale)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="paper-panel rounded-[1.5rem] p-5">
          <p className="cue-label cue-label--ink">
            {getLocalizedText(reelsShowcaseCopy.panelTitle, locale)}
          </p>
          {mode === "page" ? (
            <div className="mt-4 grid gap-4">
              {reelsShowcaseCopy.pagePanelParagraphs.map((para) => (
                <p key={para.en} className="text-base leading-7 paper-muted">
                  {getLocalizedText(para, locale)}
                </p>
              ))}
            </div>
          ) : (
            <>
              <p className="mt-4 text-base leading-7 paper-muted">
                {getLocalizedText(reelsShowcaseCopy.panelBody, locale)}
              </p>
              <div className="paper-rule mt-5" />
              <ul className="mt-5 grid gap-3">
                {reelsShowcaseCopy.bullets.map((item) => (
                  <li key={item.en} className="text-sm leading-6 paper-muted">
                    {getLocalizedText(item, locale)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p
          className={cn(
            "px-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em]",
            mode === "page" ? "text-[rgba(247,241,231,0.62)]" : "text-muted",
          )}
        >
          {isPending
            ? locale === "de"
              ? "Nächste Spur wird geladen."
              : "Loading the next lane."
            : getLocalizedText(reelsShowcaseCopy.footer, locale)}
        </p>
      </div>
    </div>
  );
}
