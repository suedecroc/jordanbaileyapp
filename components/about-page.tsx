"use client";

import { Globe2, Headphones, ShieldCheck } from "lucide-react";

import { ContactStrip } from "@/components/contact-strip";
import { FadeIn } from "@/components/fade-in";
import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { aboutPageCopy, bilingualEdge, getLocalizedText } from "@/lib/site";

const pillars = [
  {
    icon: Headphones,
    title: "Performance",
    body: {
      en: "Reads that land because the timing, control, and restraint are already there.",
      de: "Reads, die landen, weil Timing, Kontrolle und Zurückhaltung schon da sind.",
    },
  },
  {
    icon: Globe2,
    title: "Bilingual adaptation",
    body: bilingualEdge.body,
  },
  {
    icon: ShieldCheck,
    title: "Operational range",
    body: {
      en: "Tier 3 operations experience means calm under pressure, clear communication, and no wasted movement.",
      de: "Tier-3-Erfahrung bedeutet Ruhe unter Druck, klare Kommunikation und keine verschwendete Bewegung.",
    },
  },
];

export function AboutPage() {
  const { locale } = useLanguage();

  return (
    <>
      <section className="section-anchor py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="About Jordan Bailey"
            title="Real presence. Clean execution."
            description="No filler bio. Just the part that matters."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.76fr)_minmax(280px,0.44fr)]">
            <FadeIn>
              <div className="space-y-5 text-lg leading-8 text-muted">
                {aboutPageCopy.map((paragraph) => (
                  <p key={paragraph.en}>{getLocalizedText(paragraph, locale)}</p>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <aside className="panel rounded-[1.9rem] p-6 sm:p-7">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent">
                  German / English
                </p>
                <h3 className="mt-5 font-serif text-3xl leading-none text-foreground">
                  {getLocalizedText(bilingualEdge.title, locale)}
                </h3>
                <p className="mt-4 text-base leading-7 text-muted">
                  {getLocalizedText(bilingualEdge.body, locale)}
                </p>
              </aside>
            </FadeIn>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <FadeIn key={pillar.title} delay={index * 0.06}>
                  <article className="panel-soft rounded-[1.6rem] p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[rgba(240,213,168,0.08)] text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-serif text-[1.9rem] leading-none text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-muted">
                      {getLocalizedText(pillar.body, locale)}
                    </p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      <ContactStrip />
    </>
  );
}
