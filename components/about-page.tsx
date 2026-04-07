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
    <section className="section-anchor pb-8 pt-3 sm:pb-10 sm:pt-4">
      <Container>
        <div className="book-page book-page--paper p-5 sm:p-7 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(320px,0.46fr)]">
            <FadeIn>
              <div>
                <div className="book-page__number">
                  <span className="folio-pill folio-pill--ink">{pageTwo.folio}</span>
                  <p className="cue-label cue-label--ink">
                    {getLocalizedText(pageTwo.cue, locale)}
                  </p>
                </div>
                <h1 className="mt-5 max-w-[13ch] font-serif text-[2.85rem] leading-[0.9] tracking-[0.01em] paper-ink sm:text-[3.8rem]">
                  {getLocalizedText(pageTwo.title, locale)}
                </h1>
                <div className="paper-rule mt-5" />
                <div className="mt-5 max-w-[38rem] space-y-5 text-base leading-8 paper-muted sm:text-lg">
                  {aboutPageCopy.map((paragraph) => (
                    <p key={paragraph.en}>{getLocalizedText(paragraph, locale)}</p>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <aside className="panel rounded-[1.15rem] p-5 sm:p-6">
                <p className="cue-label">
                  {getLocalizedText(
                    { en: "Act II / how I work", de: "Akt II / Dossiernotizen" },
                    locale,
                  )}
                </p>
                <h2 className="mt-5 font-serif text-[2rem] leading-[0.95] text-foreground">
                  {getLocalizedText(pageTwo.bilingualTitle, locale)}
                </h2>
                <p className="mt-4 text-base leading-7 text-muted">
                  {getLocalizedText(pageTwo.bilingualBody, locale)}
                </p>
                <div className="stage-rule mt-5" />
                <ul className="mt-5 grid gap-2.5">
                  {pageTwo.markers.map((marker) => (
                    <li key={marker.en}>
                      <span className="paper-tag paper-tag--soft">
                        {getLocalizedText(marker, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid gap-3">
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

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,0.92fr)]">
            <FadeIn>
              <div className="sheet-card rounded-[1.15rem] p-5 sm:p-6">
                <p className="cue-label">
                  {getLocalizedText(
                    { en: "Where it matters", de: "Wo es trifft" },
                    locale,
                  )}
                </p>
                <div className="mt-4 space-y-4">
                  <p className="text-base leading-7 text-muted">
                    {getLocalizedText(
                      {
                        en: "Games, animation, commercial, corporate, all of it clocks fake weight right away. If the read doesn’t feel real first, nobody cares how impressive it sounds.",
                        de: "Games, Animation und Cinematic-Arbeit bestrafen falsches Gewicht sofort. Der Read muss sich gelebt anfühlen, bevor er beeindruckt.",
                      },
                      locale,
                    )}
                  </p>
                  <p className="text-base leading-7 text-muted">
                    {getLocalizedText(
                      {
                        en: "German and English are not the same line with different words on top. It has to sound natural in both, or it’s not done.",
                        de: "Deutsch und Englisch sind keine alternativen Skins derselben Zeile. Die Adaption muss auch unter Druck noch nativ klingen.",
                      },
                      locale,
                    )}
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="sheet-card rounded-[1.15rem] p-5 sm:p-6">
                <p className="cue-label">
                  {getLocalizedText(
                    { en: "How I move", de: "Wie ich arbeite" },
                    locale,
                  )}
                </p>
                <div className="mt-4 space-y-4">
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
