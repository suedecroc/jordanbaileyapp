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
    <AnimatePresence mode="sync" initial={false}>
      <m.div
        key={pathname}
        className="route-stage"
        initial={{
          opacity: 0,
          scale: 0.997,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.998,
          transition: {
            duration: 0.12,
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
  const isStudioRoute = pathname?.startsWith("/studio") ?? false;
  const isCoverRoute = isLandingRoute || isStudioRoute;

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <div className={cn("site-shell", isCoverRoute && "site-shell--cover")}>
      <div className="site-shell__backdrop" aria-hidden="true" />
      <div className="site-shell__glow site-shell__glow--left" aria-hidden="true" />
      <div className="site-shell__glow site-shell__glow--right" aria-hidden="true" />

      {!isCoverRoute ? <Navbar /> : null}

      <main className={cn("site-main", isCoverRoute && "site-main--cover")}>
        {isCoverRoute ? children : <PageTurnStage>{children}</PageTurnStage>}
      </main>

      {!isCoverRoute ? <InteriorUtilities /> : null}
      {!isCoverRoute ? <SiteFooter /> : null}
    </div>
  );
}
