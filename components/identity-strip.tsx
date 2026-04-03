"use client";

import { useLanguage } from "@/components/language-provider";
import { Container } from "@/components/ui/container";
import { getLocalizedText, identityItems } from "@/lib/site";

const repeated = [...identityItems, ...identityItems];

export function IdentityStrip() {
  const { locale } = useLanguage();

  return (
    <section className="section-anchor py-6 sm:py-8" aria-label="Brand identity">
      <Container>
        <div className="identity-marquee panel-soft rounded-[1.75rem] px-0 py-4">
          <div className="identity-track flex gap-3 px-3 sm:gap-4">
            {repeated.map((item, index) => (
              <div
                key={`${item.en}-${index}`}
                className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted sm:px-5"
              >
                {getLocalizedText(item, locale)}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
