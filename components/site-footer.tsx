"use client";

import { useLanguage } from "@/components/language-provider";
import { Container } from "@/components/ui/container";
import { contactDetails, getLocalizedText } from "@/lib/site";

export function SiteFooter() {
  const { locale } = useLanguage();

  return (
    <footer className="border-t border-[var(--line)] py-10">
      <Container className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <div className="font-serif text-3xl leading-none text-foreground">Jordan Bailey</div>
          <div className="mt-2 text-[0.72rem] uppercase tracking-[0.24em] text-accent">Et Facta Est Lux</div>
          <p className="mt-5 text-base text-muted">
            {getLocalizedText({ en: "Voice. Presence. Delivery.", de: "Stimme. Präsenz. Delivery." }, locale)}
          </p>
        </div>

        <div className="space-y-2 text-sm text-muted">
          <a className="block hover:text-foreground" href={contactDetails.emailHref}>
            {contactDetails.email}
          </a>
          <a className="block hover:text-foreground" href={contactDetails.phoneHref}>
            {contactDetails.phoneDisplay}
          </a>
          <a className="block hover:text-foreground" href={contactDetails.instagramHref} target="_blank" rel="noreferrer">
            @{contactDetails.instagramHandle}
          </a>
        </div>

        <p className="text-xs uppercase tracking-[0.24em] text-muted sm:col-span-2">
          {getLocalizedText({ en: "Built clean. No noise.", de: "Sauber gebaut. Kein Lärm." }, locale)}
        </p>
      </Container>
    </footer>
  );
}
