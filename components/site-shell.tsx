"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { InteriorUtilities } from "@/components/interior-utilities";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

function PageTurnStage({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className="route-stage">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        className="route-stage"
        initial={{
          opacity: 0,
          x: 18,
          scale: 0.996,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }}
        exit={{
          opacity: 0,
          x: -14,
          scale: 0.998,
          transition: {
            duration: 0.18,
            ease: [0.4, 0, 1, 1] as const,
          },
        }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLandingRoute = pathname === "/";

  return (
    <div className={cn("site-shell", isLandingRoute && "site-shell--cover")}>
      <div className="site-shell__backdrop" aria-hidden="true" />
      <div className="site-shell__glow site-shell__glow--left" aria-hidden="true" />
      <div className="site-shell__glow site-shell__glow--right" aria-hidden="true" />

      {!isLandingRoute ? <Navbar /> : null}

      <main className={cn("site-main", isLandingRoute && "site-main--cover")}>
        {isLandingRoute ? children : <PageTurnStage>{children}</PageTurnStage>}
      </main>

      {!isLandingRoute ? <InteriorUtilities /> : null}
      {!isLandingRoute ? <SiteFooter /> : null}
    </div>
  );
}
