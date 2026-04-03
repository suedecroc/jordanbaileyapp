import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "button-shine relative overflow-hidden border border-[rgba(240,213,168,0.34)] bg-[linear-gradient(180deg,#f3dfbb_0%,#dfbe86_34%,#b88d52_100%)] text-[#1a130b] shadow-[0_18px_38px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.36)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.4)]",
  secondary:
    "border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(29,25,20,0.92),rgba(17,15,12,0.96))] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 hover:border-[rgba(240,213,168,0.3)] hover:text-accent-strong",
  ghost:
    "border border-transparent bg-transparent text-muted hover:text-foreground",
};

export function ButtonLink({ children, href, variant = "primary", className }: ButtonLinkProps) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.18em] uppercase",
    variantClasses[variant],
    className,
  );

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
