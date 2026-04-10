"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { getLocalizedText, navigationItems } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), []);

  return (
    <>
      <header className="fixed left-1/2 top-3 z-50 -translate-x-1/2 sm:top-4">
        <div className="nav-shell flex items-center gap-0.5 px-1.5 py-1.5">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="nav-hamburger"
            onClick={toggleDrawer}
            aria-expanded={drawerOpen}
            aria-label="Open navigation menu"
          >
            <span className="nav-hamburger__line" />
            <span className="nav-hamburger__line" />
            <span className="nav-hamburger__line" />
          </button>

          {/* Desktop nav links — hidden on mobile */}
          <nav className="hidden items-center gap-0.5 sm:flex">
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

          <div className="mx-1.5 hidden h-5 w-px bg-white/15 sm:block" aria-hidden="true" />
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={cn("nav-drawer-backdrop", drawerOpen && "nav-drawer-backdrop--open")}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer panel */}
      <nav
        className={cn("nav-drawer", drawerOpen && "nav-drawer--open")}
        aria-label="Mobile navigation"
      >
        <div className="nav-drawer__header">
          <button
            type="button"
            className="nav-drawer__close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="nav-drawer__links">
          {navigationItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-drawer__link",
                  active && "nav-drawer__link--active",
                )}
              >
                <span className="nav-drawer__folio">{item.folio}</span>
                <span className="nav-drawer__meta">
                  <span className="nav-drawer__cue">
                    {getLocalizedText(item.cue, locale)}
                  </span>
                  <span className="nav-drawer__label">
                    {getLocalizedText(item.label, locale)}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="nav-drawer__footer">
          <LanguageToggle />
        </div>
      </nav>
    </>
  );
}
