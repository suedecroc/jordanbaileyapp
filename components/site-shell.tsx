"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { InteriorUtilities } from "@/components/interior-utilities";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

function PageTurnStage({ children }: { children: ReactNode }) {
  // Route changes are instant. The per-block FadeIn on each page handles
  // the entry feel — wrapping a whole route in AnimatePresence with
  // mode="sync" was double-mounting the DOM on every nav and stalling
  // the transition between Act I-IV.
  return <div className="route-stage">{children}</div>;
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

      {!isCoverRoute ? (
        <>
          <div className="site-shell__grain" aria-hidden="true" />
          <div className="site-shell__particles" aria-hidden="true" />
        </>
      ) : null}

      {!isCoverRoute ? <Navbar /> : null}

      <main className={cn("site-main", isCoverRoute && "site-main--cover")}>
        {isCoverRoute ? children : <PageTurnStage>{children}</PageTurnStage>}
      </main>

      {!isCoverRoute ? <InteriorUtilities /> : null}
      {!isCoverRoute ? <SiteFooter /> : null}
    </div>
  );
}
