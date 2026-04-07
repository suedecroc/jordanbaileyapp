import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./studio.css";

export const metadata: Metadata = {
  title: "Gigasuede Studio",
  description: "Private content engine.",
  robots: { index: false, follow: false, nocache: true },
  applicationName: "Gigasuede",
  appleWebApp: {
    capable: true,
    title: "Gigasuede",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#260610",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div className="studio-root">{children}</div>;
}
