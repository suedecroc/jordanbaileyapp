"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/components/language-provider";
import { Container } from "@/components/ui/container";
import { getLocalizedText, navigationItems } from "@/lib/site";

export function ActNavigator() {
  const pathname = usePathname();
  const { locale } = useLanguage();

  const currentIndex = navigationItems.findIndex((n) => n.href === pathname);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? navigationItems[currentIndex - 1] : null;
  const next =
    currentIndex < navigationItems.length - 1
      ? navigationItems[currentIndex + 1]
      : null;

  if (!prev && !next) return null;

  return (
    <nav className="act-navigator" aria-label="Page navigation">
      <Container>
        <div className="act-navigator__inner">
          {prev ? (
            <Link href={prev.href} className="act-navigator__link">
              <span className="act-navigator__arrow" aria-hidden="true">
                &larr;
              </span>
              <span className="act-navigator__meta">
                <span className="act-navigator__cue">
                  {getLocalizedText(prev.cue, locale)}
                </span>
                <span className="act-navigator__label">
                  {getLocalizedText(prev.label, locale)}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link href={next.href} className="act-navigator__link act-navigator__link--next">
              <span className="act-navigator__meta">
                <span className="act-navigator__cue">
                  {getLocalizedText(next.cue, locale)}
                </span>
                <span className="act-navigator__label">
                  {getLocalizedText(next.label, locale)}
                </span>
              </span>
              <span className="act-navigator__arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </Container>
    </nav>
  );
}
