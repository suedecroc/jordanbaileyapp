"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { Container } from "@/components/ui/container";
import { contactDetails, getLocalizedText, navigationItems } from "@/lib/site";

export function SiteFooter() {
  const { locale } = useLanguage();

  return (
    <footer className="pb-8 pt-2 sm:pb-10">
      <Container>
        <div className="footer-shell px-5 py-6 sm:px-7 sm:py-7">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.75fr)_auto]">
            <div>
              <div className="font-serif text-[2.4rem] leading-none text-[var(--ink-surface-text)]">
                Jordan Bailey
              </div>
              <div className="mt-2 text-[0.68rem] uppercase tracking-[0.28em] text-[#dfc29b]">
                End of page. Booking still open.
              </div>
              <p className="mt-5 max-w-xl text-base leading-7 text-[rgba(247,241,231,0.72)]">
                {getLocalizedText(
                  {
                    en: "Voice for games, animation, commercial, corporate, and cinematic work. Funny when it helps. Grounded when it matters. Easy to book.",
                    de: "Voice für Games, Animation, Cinematic-Arbeit und präzise Briefings, die Kontrolle vor Lärm brauchen.",
                  },
                  locale,
                )}
              </p>
            </div>

            <nav className="grid gap-2 sm:grid-cols-2">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link block leading-none">
                  <span className="nav-link__folio">{item.folio}</span>
                  <span className="block text-inherit">
                    {getLocalizedText(item.label, locale)}
                  </span>
                  <span className="mt-1 block text-[0.62rem] tracking-[0.24em] text-[rgba(247,241,231,0.7)]">
                    {getLocalizedText(item.cue, locale)}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="space-y-3 text-sm text-[rgba(247,241,231,0.72)]">
              <a className="block hover:text-[var(--ink-surface-text)]" href={contactDetails.emailHref}>
                {contactDetails.email}
              </a>
              <a className="block hover:text-[var(--ink-surface-text)]" href={contactDetails.phoneHref}>
                {contactDetails.phoneDisplay}
              </a>
              <a
                className="block hover:text-[var(--ink-surface-text)]"
                href={contactDetails.instagramHref}
                target="_blank"
                rel="noreferrer"
              >
                @{contactDetails.instagramHandle}
              </a>
              <a
                className="block hover:text-[var(--ink-surface-text)]"
                href={contactDetails.linkedinHref}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="stage-rule mt-6" />

          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.24em] text-[rgba(247,241,231,0.66)]">
            {getLocalizedText(
              {
                en: "Made to hit. Still easy to book.",
                de: "Gebaut wie eine Performance. Trotzdem leicht zu buchen.",
              },
              locale,
            )}
          </p>
        </div>
      </Container>
    </footer>
  );
}
