"use client";

import { ArrowRight } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { pageTwo } from "@/lib/home";
import { aboutPageCopy, getLocalizedText } from "@/lib/site";

export function AboutPage() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor pb-5 pt-1 sm:pb-7 sm:pt-2">
      <Container>
        <div className="book-page book-page--paper p-4 sm:p-5 lg:p-7">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.94fr)_minmax(320px,0.46fr)]">
            <FadeIn>
              <div>
                <div className="book-page__number">
                  <span className="folio-pill folio-pill--ink">{pageTwo.folio}</span>
                  <p className="cue-label cue-label--ink">
                    {getLocalizedText(pageTwo.cue, locale)}
                  </p>
                </div>
                <h1 className="mt-3.5 max-w-[13ch] font-serif text-[2.85rem] leading-[0.9] tracking-[0.01em] paper-ink sm:text-[3.8rem]">
                  {getLocalizedText(pageTwo.title, locale)}
                </h1>
                <div className="paper-rule mt-4" />
                <div className="mt-4 max-w-[38rem] space-y-4 text-base leading-8 paper-muted sm:text-lg">
                  {aboutPageCopy.map((paragraph) => (
                    <p key={paragraph.en}>{getLocalizedText(paragraph, locale)}</p>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <aside className="panel rounded-[1.15rem] p-4 sm:p-5">
                <p className="cue-label">
                  {getLocalizedText(
                    { en: "Act II / how I work", de: "Akt II / Dossiernotizen" },
                    locale,
                  )}
                </p>
                <h2 className="mt-3.5 font-serif text-[2rem] leading-[0.95] text-foreground">
                  {getLocalizedText(pageTwo.bilingualTitle, locale)}
                </h2>
                <p className="mt-3 text-base leading-7 text-muted">
                  {getLocalizedText(pageTwo.bilingualBody, locale)}
                </p>
                <div className="stage-rule mt-4" />
                <ul className="mt-4 grid gap-2.5">
                  {pageTwo.markers.map((marker) => (
                    <li key={marker.en}>
                      <span className="paper-tag paper-tag--soft">
                        {getLocalizedText(marker, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid gap-3">
                  <ButtonLink href="/reels">
                    {getLocalizedText({ en: "Go hear the work", de: "Zu Seite III" }, locale)}
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink href="/book" variant="secondary">
                    {getLocalizedText(
                      { en: "Go book it", de: "Direkt zum Booking" },
                      locale,
                    )}
                  </ButtonLink>
                </div>
              </aside>
            </FadeIn>
          </div>

          <div className="mt-5 grid gap-3.5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,0.92fr)]">
            <FadeIn>
              <div className="sheet-card rounded-[1.15rem] p-4 sm:p-5">
                <p className="cue-label">
                  {getLocalizedText(
                    { en: "Where it matters", de: "Wo es trifft" },
                    locale,
                  )}
                </p>
                <div className="mt-3 space-y-3">
                  <p className="text-base leading-7 text-muted">
                    {getLocalizedText(
                      {
                        en: "Across games, animation, commercial, and corporate, the standard stays the same: make it real. Audiences can hear when a read is trying too hard. If the honesty is missing, the rest falls flat.",
                        de: "Quer durch Games, Animation, Commercial und Corporate bleibt der Standard derselbe: Es muss echt klingen. Das Publikum hört sofort, wenn ein Read zu gewollt ist. Fehlt die Ehrlichkeit, fällt der Rest flach.",
                      },
                      locale,
                    )}
                  </p>
                  <p className="text-base leading-7 text-muted">
                    {getLocalizedText(
                      {
                        en: "German and English require the same level of precision, but not the same approach. Both need to sound lived in, natural, and effortless. Anything less feels off.",
                        de: "Deutsch und Englisch verlangen dasselbe Maß an Präzision, aber nicht denselben Ansatz. Beide müssen gelebt, natürlich und mühelos klingen. Alles andere fühlt sich falsch an.",
                      },
                      locale,
                    )}
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="sheet-card rounded-[1.15rem] p-4 sm:p-5">
                <p className="cue-label">
                  {getLocalizedText(
                    { en: "How I work", de: "Wie ich arbeite" },
                    locale,
                  )}
                </p>
                <div className="mt-3 space-y-3">
                  {pageTwo.detailCards.map((card) => (
                    <p key={card.en} className="text-base leading-7 text-muted">
                      {getLocalizedText(card, locale)}
                    </p>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
