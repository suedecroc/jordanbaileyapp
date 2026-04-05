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
  primary: "button-rail",
  secondary: "button-rail-secondary",
  ghost: "button-rail-ghost",
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]",
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
