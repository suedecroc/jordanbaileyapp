"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { Container } from "@/components/ui/container";
import { pageFour } from "@/lib/home";
import { getLocalizedText } from "@/lib/site";

export function BookPage() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor pb-5 pt-1 sm:pb-7 sm:pt-2">
      <Container>
        <div className="book-page book-page--paper p-4 sm:p-5 lg:p-7">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.58fr)] xl:items-start">
            <FadeIn>
              <div>
                <div className="book-page__number">
                  <span className="folio-pill">{pageFour.folio}</span>
                  <p className="cue-label">{getLocalizedText(pageFour.cue, locale)}</p>
                </div>
                <p className="stage-epigraph mt-3.5 max-w-[38rem]">
                  {getLocalizedText(pageFour.availabilityQuote, locale)}
                </p>
                <h1 className="mt-3.5 max-w-[13ch] font-serif text-[2.85rem] leading-[0.9] tracking-[0.01em] text-foreground sm:text-[3.8rem]">
                  {getLocalizedText(pageFour.title, locale)}
                </h1>
                <p className="mt-3 max-w-[35rem] text-base leading-7 text-muted-strong sm:text-lg sm:leading-8">
                  {getLocalizedText(pageFour.body, locale)}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {pageFour.formMarkers.map((marker) => (
                    <span key={marker.en} className="paper-tag">
                      {getLocalizedText(marker, locale)}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="hero-portrait min-h-[420px]">
                <Image
                  src={pageFour.heroImage.src}
                  alt={getLocalizedText(pageFour.heroImage.alt, locale)}
                  width={1200}
                  height={1600}
                  priority
                  sizes="(max-width: 1279px) 100vw, 38vw"
                  className="h-full min-h-[420px] w-full object-cover object-[center_25%]"
                />
              </div>
            </FadeIn>
          </div>

          <div className="stage-rule mt-5" />

          <FadeIn>
            <div id="booking-form" className="mt-5 scroll-mt-32">
              <BookingForm />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
