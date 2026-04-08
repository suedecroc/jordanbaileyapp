"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronUp } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { useLanguage } from "@/components/language-provider";
import { getLocalizedText, navigationItems } from "@/lib/site";
import { cn } from "@/lib/utils";

const INTERIOR_ROUTES = new Set(navigationItems.map((item) => item.href));

export function InteriorUtilities() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);

  const isInteriorRoute = INTERIOR_ROUTES.has(pathname as "/home" | "/about" | "/reels" | "/book");

  const bookingHref = pathname === "/book" ? "#booking-form" : "/book#booking-form";

  const activeIndex = useMemo(
    () => navigationItems.findIndex((item) => item.href === pathname),
    [pathname],
  );

  useEffect(() => {
    if (!isInteriorRoute || typeof window === "undefined") {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;

      const nextThreshold = Math.max(window.innerHeight * 0.9, 240);
      const nextScroll = window.scrollY;
      const nextMax =
        document.documentElement.scrollHeight - window.innerHeight;

      setShowControls(nextScroll > nextThreshold);
      setProgress(nextMax > 0 ? Math.min(1, nextScroll / nextMax) : 0);
    };

    const handleScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isInteriorRoute, pathname]);

  if (!isInteriorRoute) {
    return null;
  }

  return (
    <>
      <nav
        aria-label={getLocalizedText(
          { en: "Act progress", de: "Aktverlauf" },
          locale,
        )}
        className="act-spine"
      >
        <div className="act-spine__rail">
          <span className="act-spine__track" aria-hidden="true" />
          <span
            className="act-spine__progress"
            aria-hidden="true"
            style={{ transform: `scaleY(${Math.max(progress, 0.02)})` }}
          />
          <ol className="act-spine__list">
            {navigationItems.map((item, index) => {
              const active = index === activeIndex;

              return (
                <li
                  key={item.href}
                  className={cn("act-spine__item", active && "act-spine__item--active")}
                >
                  <Link
                    href={item.href}
                    className="act-spine__link"
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="act-spine__dot" aria-hidden="true" />
                    <span className="act-spine__folio">{item.folio}</span>
                    <span className="act-spine__cue">
                      {getLocalizedText(item.cue, locale)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <div
        className={cn(
          "floating-utility-stack",
          showControls && "floating-utility-stack--visible",
        )}
      >
        <ButtonLink href={bookingHref} className="floating-booking-rail">
          <span>{getLocalizedText({ en: "Book Jordan", de: "Jordan buchen" }, locale)}</span>
          <ArrowUpRight className="h-4 w-4" />
        </ButtonLink>

        <button
          type="button"
          onClick={() => {
            const behavior = prefersReducedMotion ? "auto" : "smooth";
            const target = document.scrollingElement ?? document.documentElement;
            target.scrollTo({ top: 0, behavior });
            window.scrollTo({ top: 0, behavior });
          }}
          className="icon-rail floating-top-rail"
          aria-label={getLocalizedText(
            { en: "Back to top", de: "Nach oben" },
            locale,
          )}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
