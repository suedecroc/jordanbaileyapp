"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { getLocalizedText, navigationItems } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { locale } = useLanguage();

  return (
    <header className="fixed left-1/2 top-3 z-50 -translate-x-1/2 sm:top-4">
      <div className="nav-shell flex items-center gap-0.5 px-1.5 py-1.5">
        <nav className="flex items-center gap-0.5">
          {navigationItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link flex flex-col items-center px-3.5 py-2 text-center leading-none",
                  active && "nav-link--active",
                )}
              >
                <span className="nav-link__folio">{item.folio}</span>
                <span className="mt-0.5 block text-[0.62rem] tracking-[0.18em] uppercase">
                  {getLocalizedText(item.label, locale)}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="mx-1.5 h-5 w-px bg-white/15" aria-hidden="true" />
        <LanguageToggle />
      </div>
    </header>
  );
}
