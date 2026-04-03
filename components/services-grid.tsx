"use client";

import { ArrowUpRight, Headphones, ShieldCheck, Sparkles, Wrench } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getLocalizedText, serviceCards } from "@/lib/site";

const iconMap = {
  voiceover: Headphones,
  operations: ShieldCheck,
  creative: Sparkles,
  custom: Wrench,
};

export function ServicesGrid() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Book me for what actually matters."
          description="The work is clean when the brief is clean. The upside is better when the thinking starts early."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {serviceCards.map((card, index) => {
            const Icon = iconMap[card.id];
            return (
              <FadeIn key={card.id} delay={index * 0.06}>
                <article className="panel rounded-[1.75rem] p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-[rgba(240,213,168,0.07)] text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted" />
                  </div>
                  <h3 className="mt-6 font-serif text-3xl leading-none text-foreground">{card.title}</h3>
                  <p className="mt-4 text-base leading-7 text-muted">
                    {getLocalizedText(card.body, locale)}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-8">
          <ButtonLink href="/book">{getLocalizedText({ en: "Book Jordan", de: "Jordan buchen" }, locale)}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
