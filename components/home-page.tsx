"use client";

import { ArrowRight } from "lucide-react";

import { ContactStrip } from "@/components/contact-strip";
import { FadeIn } from "@/components/fade-in";
import { Hero } from "@/components/hero";
import { IdentityStrip } from "@/components/identity-strip";
import { useLanguage } from "@/components/language-provider";
import { ReelsShowcase } from "@/components/reels-showcase";
import { SectionHeading } from "@/components/section-heading";
import { ServicesGrid } from "@/components/services-grid";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { aboutPreview, bilingualEdge, getLocalizedText } from "@/lib/site";

export function HomePage() {
  const { locale } = useLanguage();

  return (
    <>
      <Hero />
      <IdentityStrip />
      <ReelsShowcase mode="home" />

      <section className="section-anchor py-16 sm:py-24" id="about">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.42fr)]">
            <FadeIn>
              <div>
                <SectionHeading eyebrow="About" title="Not just a voice." />
                <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-muted">
                  {aboutPreview.map((paragraph) => (
                    <p key={paragraph.en}>{getLocalizedText(paragraph, locale)}</p>
                  ))}
                </div>
                <div className="mt-8">
                  <ButtonLink href="/about" variant="secondary">
                    About Jordan
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <aside className="panel rounded-[1.9rem] p-6 sm:p-7">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-accent">
                  German edge
                </p>
                <h3 className="mt-5 font-serif text-3xl leading-none text-foreground sm:text-[2.2rem]">
                  {getLocalizedText(bilingualEdge.title, locale)}
                </h3>
                <p className="mt-4 text-base leading-7 text-muted">
                  {getLocalizedText(bilingualEdge.body, locale)}
                </p>
                <div className="gold-rule mt-6" />
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-muted">
                  {getLocalizedText(bilingualEdge.badgeBody, locale)}
                </p>
              </aside>
            </FadeIn>
          </div>
        </Container>
      </section>

      <ServicesGrid />
      <ContactStrip />
    </>
  );
}
