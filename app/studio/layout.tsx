import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./studio.css";

export const metadata: Metadata = {
  title: "Gigasuede Studio",
  description: "Private content engine.",
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div className="studio-root">{children}</div>;
}
