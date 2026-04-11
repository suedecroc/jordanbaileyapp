"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FadeIn({
  children,
  className,
  delay = 0,
  staggerIndex,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** When provided, computes delay as staggerIndex * 0.06 (overrides delay). */
  staggerIndex?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const resolvedDelay = staggerIndex !== undefined ? staggerIndex * 0.06 : delay;

  return (
    <m.div
      className={cn(className)}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.26, delay: resolvedDelay, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {children}
    </m.div>
  );
}
