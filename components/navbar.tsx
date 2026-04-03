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
      <Container className="pt-4 sm:pt-5">
        <div className="panel rounded-[1.65rem] px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="min-w-0">
              <div className="font-serif text-2xl leading-none tracking-[0.02em] text-foreground">Jordan Bailey</div>
              <div className="mt-1 text-[0.72rem] uppercase tracking-[0.24em] text-accent">Et Facta Est Lux</div>
            </Link>

            <div className="hidden items-center gap-3 lg:flex">
              <nav className="flex items-center gap-2">
                {navigationItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-full px-4 py-3 text-[0.74rem] font-semibold uppercase tracking-[0.22em]",
                        active
                          ? "bg-[rgba(240,213,168,0.1)] text-foreground"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      {getLocalizedText(item.label, locale)}
                    </Link>
                  );
                })}
              </nav>
              <LanguageToggle />
              <ButtonLink href="/book" className="min-w-[180px]">
                {getLocalizedText({ en: "Book Jordan", de: "Jordan buchen" }, locale)}
              </ButtonLink>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <LanguageToggle />
              <button
                type="button"
                onClick={() => setMobileOpen((current) => !current)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.02)] text-foreground"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <div className="mt-4 border-t border-[var(--line)] pt-4 lg:hidden">
              <nav className="grid gap-2">
                {navigationItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em]",
                        active
                          ? "bg-[rgba(240,213,168,0.08)] text-foreground"
                          : "text-muted hover:bg-[rgba(255,255,255,0.03)] hover:text-foreground",
                      )}
                    >
                      {getLocalizedText(item.label, locale)}
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
