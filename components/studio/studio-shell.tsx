"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const TABS = [
  { href: "/studio", label: "overview", short: "home" },
  { href: "/studio/ff", label: "feetfinder", short: "FF" },
  { href: "/studio/ffig", label: "ff·ig", short: "IG" },
  { href: "/studio/me", label: "personal", short: "me" },
];

const TICKER = "★ atlanta · a private broadcast ★ premium unleaded ★ no thoughts, just captions ★";

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/studio";

  function isActive(href: string) {
    if (href === "/studio") return pathname === "/studio";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <header className="studio-shell">
        <Link href="/studio" className="studio-shell__mark" aria-label="gigasuede home">
          GIGASUEDE
        </Link>
        <div className="studio-shell__ticker" aria-hidden="true">
          <span>{TICKER}</span>
        </div>
        <nav className="studio-shell__nav" aria-label="account">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`studio-shell__tab${isActive(t.href) ? " is-on" : ""}`}
              aria-current={isActive(t.href) ? "page" : undefined}
            >
              <span className="studio-shell__tab-long">{t.label}</span>
              <span className="studio-shell__tab-short">{t.short}</span>
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </>
  );
}
