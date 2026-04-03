"use client";

import Image from "next/image";

import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { bilingualEdge, getLocalizedText, homeHero } from "@/lib/site";

export function Hero() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor relative overflow-hidden pb-10 pt-4 sm:pb-14 sm:pt-6">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.74fr)] lg:gap-12">
          <FadeIn>
            <div className="relative z-10">
              <p className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                {getLocalizedText(homeHero.kicker, locale)}
              </p>
              <h1 className="font-serif text-[3.3rem] leading-[0.88] tracking-[0.01em] text-foreground sm:text-[4.4rem] lg:text-[5.6rem]">
                Jordan Bailey
                <span className="mt-3 block text-lg font-medium italic tracking-[0.08em] text-accent-strong sm:text-xl">
                  Et Facta Est Lux
                </span>
              </h1>
              <p className="mt-8 max-w-3xl text-4xl leading-tight tracking-[0.01em] text-foreground sm:text-5xl lg:text-[4.4rem]">
                {homeHero.headline}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {getLocalizedText(homeHero.subhead, locale)}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/book" className="sm:min-w-[190px]">
                  {getLocalizedText(homeHero.primaryCta, locale)}
                </ButtonLink>
                <ButtonLink href="/#featured-reels" variant="secondary" className="sm:min-w-[190px]">
                  {getLocalizedText(homeHero.secondaryCta, locale)}
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.22em] text-muted">
                {getLocalizedText(homeHero.note, locale)}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative">
              <div className="hero-image-shadow panel relative overflow-hidden rounded-[2rem] border border-[var(--line-strong)]">
                <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(9,8,7,0.1),rgba(9,8,7,0.42)_72%,rgba(9,8,7,0.72)_100%)]" />
                <Image
                  src="/media/images/hero.webp"
                  alt="Jordan Bailey smiling in a warmly lit setting"
                  width={900}
                  height={1200}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="panel-soft absolute bottom-5 left-5 max-w-[16rem] rounded-[1.4rem] px-4 py-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                  {getLocalizedText(bilingualEdge.badge, locale)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-strong">
                  {getLocalizedText(bilingualEdge.badgeBody, locale)}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
