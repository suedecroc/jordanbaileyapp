"use client";

import Image from "next/image";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { pageFour } from "@/lib/home";
import { contactDetails, getLocalizedText } from "@/lib/site";

export function BookPage() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor pb-8 pt-3 sm:pb-10 sm:pt-4">
      <Container>
        <div className="book-page book-page--paper p-5 sm:p-7 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.58fr)] xl:items-start">
            <FadeIn>
              <div>
                <div className="book-page__number">
                  <span className="folio-pill">{pageFour.folio}</span>
                  <p className="cue-label">{getLocalizedText(pageFour.cue, locale)}</p>
                </div>
                <p className="stage-epigraph mt-5 max-w-[38rem]">
                  {getLocalizedText(pageFour.availabilityQuote, locale)}
                </p>
                <h1 className="mt-5 max-w-[13ch] font-serif text-[2.85rem] leading-[0.9] tracking-[0.01em] text-foreground sm:text-[3.8rem]">
                  {getLocalizedText(pageFour.title, locale)}
                </h1>
                <p className="mt-4 max-w-[35rem] text-base leading-7 text-muted-strong sm:text-lg sm:leading-8">
                  {getLocalizedText(pageFour.body, locale)}
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
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

          <div className="stage-rule mt-7" />

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,0.78fr)_minmax(300px,0.42fr)] xl:items-start">
            <FadeIn>
              <div id="booking-form" className="scroll-mt-32">
                <BookingForm />
              </div>
            </FadeIn>

            <div className="grid gap-5">
              <FadeIn delay={0.08}>
                <div className="paper-panel rounded-[1.15rem] p-5 sm:p-6">
                  <p className="cue-label cue-label--ink">
                    {getLocalizedText(
                      { en: "How this usually goes", de: "Wie es meistens läuft" },
                      locale,
                    )}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {pageFour.duoImages.map((image) => (
                      <div key={image.src} className="min-w-0">
                        <div className="duo-card aspect-square">
                          <Image
                            src={image.src}
                            alt={getLocalizedText(image.alt, locale)}
                            width={500}
                            height={500}
                            sizes="(max-width: 640px) 42vw, 180px"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] paper-muted">
                          {getLocalizedText(image.label, locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="paper-rule mt-5" />
                  <p className="mt-4 text-base leading-7 paper-muted">
                    {getLocalizedText(pageFour.duoCaption, locale)}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.12}>
                <aside className="panel-soft rounded-[1.15rem] p-5 sm:p-6">
                  <p className="cue-label">
                    {getLocalizedText(
                      { en: "Need the fast route?", de: "Brauchst du den schnellen Weg?" },
                      locale,
                    )}
                  </p>
                  <p className="stage-epigraph mt-4">
                    {getLocalizedText(
                      { en: "HOW LOVELY!", de: "WIE SCHÖN!" },
                      locale,
                    )}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {getLocalizedText(
                      {
                        en: "If the schedule is already moving, skip the form and hit me directly. Tier 3 brain still works here too.",
                        de: "Wenn der Zeitplan schon läuft, überspring die Zeremonie und nimm den direkten Weg.",
                      },
                      locale,
                    )}
                  </p>
                  <div className="mt-5 grid gap-3">
                    <ButtonLink
                      href={contactDetails.emailHref}
                      variant="secondary"
                      className="justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <Mail className="h-4 w-4" />
                        {getLocalizedText(
                          { en: "Email Jordan", de: "Jordan mailen" },
                          locale,
                        )}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                    <ButtonLink
                      href={contactDetails.phoneHref}
                      variant="secondary"
                      className="justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <Phone className="h-4 w-4" />
                        {getLocalizedText(
                          { en: "Call Jordan", de: "Jordan anrufen" },
                          locale,
                        )}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                  </div>
                </aside>
              </FadeIn>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
