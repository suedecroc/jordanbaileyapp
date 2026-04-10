"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { ActNavigator } from "@/components/act-navigator";
import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { ReelsShowcase } from "@/components/reels-showcase";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { contactCopy, pageOne } from "@/lib/home";
import { contactDetails, getLocalizedText, navigationItems } from "@/lib/site";

export function HomePage() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor pb-5 pt-1 sm:pb-7 sm:pt-2">
      <Container className="space-y-4 sm:space-y-5">
        <section className="book-page book-page--paper p-4 sm:p-5 lg:p-7">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.7fr)] xl:items-start">
            <FadeIn>
              <div>
                <div className="book-page__number">
                  <span className="folio-pill">{pageOne.folio}</span>
                  <p className="cue-label">{getLocalizedText(pageOne.cue, locale)}</p>
                </div>
                <p className="stage-kicker mt-3.5">
                  {getLocalizedText(
                    {
                      en: "Act I / quick read of the room",
                      de: "Akt I / der Raum wird still, bevor die Zeile landet",
                    },
                    locale,
                  )}
                </p>
                <h1 className="mt-3 max-w-[13ch] font-serif text-[2.85rem] leading-[0.9] tracking-[0.01em] text-foreground sm:text-[4.13rem]">
                  {getLocalizedText(pageOne.title, locale)}
                </h1>
                <div className="mt-3.5 max-w-[38rem] space-y-4 text-base leading-7 text-muted-strong sm:text-lg sm:leading-8">
                  {getLocalizedText(pageOne.body, locale).split("\n\n").map((para) => (
                    <p key={para.slice(0, 20)}>{para}</p>
                  ))}
                </div>
                <p className="mt-4 max-w-[34rem] text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong sm:text-[0.92rem]">
                  {getLocalizedText(pageOne.capabilityQuote, locale)}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/book" className="sm:min-w-[194px]">
                    {getLocalizedText(pageOne.primaryCta, locale)}
                  </ButtonLink>
                  <ButtonLink
                    href="/reels"
                    variant="secondary"
                    className="sm:min-w-[194px]"
                  >
                    {getLocalizedText(pageOne.secondaryCta, locale)}
                  </ButtonLink>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="grid gap-3.5">
                <div className="panel-soft rounded-[1.2rem] p-4 sm:p-5">
                  <p className="cue-label">
                    {getLocalizedText(pageOne.video.eyebrow, locale)}
                  </p>
                  <h2 className="mt-3 max-w-[14ch] font-serif text-[2.04rem] leading-[0.96] text-foreground">
                    {getLocalizedText(pageOne.video.title, locale)}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted">
                    {getLocalizedText(pageOne.video.body, locale)}
                  </p>
                  <div className="home-video-frame mt-4">
                    <video
                      className="home-video"
                      controls
                      playsInline
                      preload="metadata"
                      poster={pageOne.video.poster}
                      aria-label={getLocalizedText(pageOne.video.title, locale)}
                    >
                      <source src={pageOne.video.src} type="video/mp4" />
                    </video>
                  </div>
                </div>

                <div className="panel-soft rounded-[1.2rem] p-4 sm:p-5">
                  <p className="cue-label">
                    {getLocalizedText(
                      { en: "German / English", de: "Bilingualer Vorteil" },
                      locale,
                    )}
                  </p>
                  <h2 className="mt-3 max-w-[12ch] font-serif text-[2.33rem] leading-[0.90] text-foreground">
                    {getLocalizedText(
                      {
                        en: "English and German should both sound like me.",
                        de: "Englisch und Deutsch sollten beide teuer klingen.",
                      },
                      locale,
                    )}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted">
                    {getLocalizedText(
                      {
                        en: "That matters for casting, adaptation, pickups, and trust. If the tone drops when the language switches, the job’s not done.",
                        de: "Das verändert Casting, Adaption, Pickups und wie schnell ein Raum entscheidet, dass er dem Read vertrauen kann. Das ist echter Vorteil.",
                      },
                      locale,
                    )}
                  </p>
                </div>

                <article className="sheet-card rounded-[1.15rem] p-3.5 sm:p-4">
                  <p className="cue-label">
                    {getLocalizedText(pageOne.reaction.label, locale)}
                  </p>
                  <h2 className="mt-3 font-serif text-[2rem] leading-none text-foreground">
                    {getLocalizedText(pageOne.reaction.title, locale)}
                  </h2>
                  <div className="hero-portrait mt-3 min-h-[230px]">
                    <Image
                      src={pageOne.reaction.src}
                      alt={getLocalizedText(pageOne.reaction.alt, locale)}
                      width={1200}
                      height={900}
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      className="h-full min-h-[230px] w-full object-cover object-[center_18%]"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {getLocalizedText(pageOne.reaction.caption, locale)}
                  </p>
                </article>
              </div>
            </FadeIn>
          </div>

          <div className="stage-rule mt-5" />

          <div className="mt-5">
            <ReelsShowcase mode="home" />
          </div>

          <div className="mt-4 grid gap-3.5 lg:grid-cols-3">
            {pageOne.cards.map((card, index) => (
              <FadeIn key={card.title.en} delay={index * 0.04}>
                <article className="sheet-card rounded-[1.15rem] p-4">
                  <p className="cue-label">{getLocalizedText(card.eyebrow, locale)}</p>
                  <h2 className="mt-3 max-w-[12ch] font-serif text-[1.95rem] leading-[0.96] text-foreground">
                    {getLocalizedText(card.title, locale)}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted">
                    {getLocalizedText(card.body, locale)}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.68fr)_minmax(300px,0.32fr)]">
            <FadeIn>
              <div className="paper-panel rounded-[1.15rem] p-5 sm:p-6">
                <div className="book-page__number">
                  <span className="folio-pill folio-pill--ink">II</span>
                  <p className="cue-label cue-label--ink">
                    {getLocalizedText(pageOne.teaser.eyebrow, locale)}
                  </p>
                </div>
                <h2 className="mt-3.5 font-serif text-[2.4rem] leading-[0.95] paper-ink">
                  {getLocalizedText(pageOne.teaser.title, locale)}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 paper-muted">
                  {getLocalizedText(pageOne.teaser.body, locale)}
                </p>
                <div className="paper-rule mt-4" />
                <div className="mt-4">
                  <ButtonLink href="/about" variant="secondary">
                    {getLocalizedText(
                      { en: "Turn to the dossier", de: "Zum Dossier" },
                      locale,
                    )}
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <aside className="panel-soft rounded-[1.15rem] p-4 sm:p-5">
                <p className="cue-label">
                  {getLocalizedText({ en: "Next up", de: "Nächste Seiten" }, locale)}
                </p>
                <div className="mt-4 grid gap-3">
                  {navigationItems.slice(1).map((item) => (
                    <ButtonLink
                      key={item.href}
                      href={item.href}
                      variant="secondary"
                      className="justify-between"
                    >
                      <span>{`${item.folio} ${getLocalizedText(item.label, locale)}`}</span>
                      <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                  ))}
                </div>
              </aside>
            </FadeIn>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
          <FadeIn>
            <div className="paper-panel rounded-[1.15rem] p-5 sm:p-6">
              <p className="cue-label cue-label--ink">
                {getLocalizedText(contactCopy.eyebrow, locale)}
              </p>
              <h2 className="mt-3 font-serif text-[2.4rem] leading-[0.95] paper-ink">
                {getLocalizedText(contactCopy.title, locale)}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 paper-muted">
                {getLocalizedText(contactCopy.body, locale)}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/book">
                  {getLocalizedText({ en: "Open Page IV", de: "Seite IV öffnen" }, locale)}
                </ButtonLink>
                <ButtonLink href={contactDetails.emailHref} variant="secondary">
                  {getLocalizedText(
                    { en: "Email Jordan", de: "Jordan mailen" },
                    locale,
                  )}
                </ButtonLink>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <aside className="sheet-card rounded-[1.15rem] p-4 sm:p-5">
              <p className="cue-label">
                {getLocalizedText(
                  { en: "Quick read", de: "Kurzfassung" },
                  locale,
                )}
              </p>
              <div className="mt-4 grid gap-2.5">
                <span className="paper-tag">
                  {getLocalizedText(
                    { en: "Games / animation / cinematic", de: "Games / Animation / Cinematic" },
                    locale,
                  )}
                </span>
                <span className="paper-tag">
                  {getLocalizedText(
                    { en: "Commercial / corporate too", de: "Englisch + Deutsch Adaption" },
                    locale,
                  )}
                </span>
                <span className="paper-tag">
                  {getLocalizedText(
                    { en: "English + German that still sounds natural", de: "Ruhig, wenn die Produktion wild wird" },
                    locale,
                  )}
                </span>
                <span className="paper-tag">
                  {getLocalizedText(
                    { en: "Tier 3 calm if things get ugly", de: "Tier-3-Ruhe, wenn's hart wird" },
                    locale,
                  )}
                </span>
              </div>
            </aside>
          </FadeIn>
        </section>
      </Container>
      <ActNavigator />
    </section>
  );
}
