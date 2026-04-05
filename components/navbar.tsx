"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getLocalizedText, navigationItems } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className="pt-3 sm:pt-5">
        <div className="nav-shell px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <Link href="/" className="min-w-0 max-w-[9.5rem] sm:max-w-none">
              <div className="font-serif text-[1.75rem] leading-none tracking-[0.02em] text-[var(--ink-surface-text)] sm:text-[2rem]">
                Jordan Bailey
              </div>
              <div className="mt-1 text-[0.54rem] leading-[1.35] uppercase tracking-[0.22em] text-[#dfc29b] sm:mt-1.5 sm:text-[0.68rem] sm:tracking-[0.28em]">
                Voice / English + German / Act Structure
              </div>
            </Link>

            <div className="hidden items-center gap-3 xl:flex">
              <nav className="flex items-stretch gap-2">
                {navigationItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "nav-link min-w-[104px] text-left leading-none",
                        active && "nav-link--active",
                      )}
                    >
                      <span className="nav-link__folio">{item.folio}</span>
                      <span className="block text-inherit">
                        {getLocalizedText(item.label, locale)}
                      </span>
                      <span className="mt-1 block text-[0.6rem] tracking-[0.24em] text-[rgba(247,241,231,0.7)]">
                        {getLocalizedText(item.cue, locale)}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <LanguageToggle />
              <ButtonLink href="/book" className="min-w-[176px]">
                {getLocalizedText({ en: "Book Jordan", de: "Jordan buchen" }, locale)}
              </ButtonLink>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden">
              <LanguageToggle />
              <button
                type="button"
                onClick={() => setMobileOpen((current) => !current)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                className="icon-rail inline-flex h-11 w-11 items-center justify-center text-[var(--ink-surface-text)] sm:h-12 sm:w-12"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <div className="mt-4 border-t border-[var(--line)] pt-4 xl:hidden">
              <nav className="grid gap-2">
                {navigationItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "nav-link block leading-none",
                        active && "nav-link--active",
                      )}
                    >
                      <span className="nav-link__folio">{item.folio}</span>
                      <span className="block text-inherit">
                        {getLocalizedText(item.label, locale)}
                      </span>
                      <span className="mt-1 block text-[0.62rem] tracking-[0.24em] text-[rgba(247,241,231,0.7)]">
                        {getLocalizedText(item.cue, locale)}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <ButtonLink href="/book" className="mt-4 w-full">
                {getLocalizedText({ en: "Book Jordan", de: "Jordan buchen" }, locale)}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
