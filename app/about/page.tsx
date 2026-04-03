import type { Metadata } from "next";

import { AboutPage } from "@/components/about-page";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Jordan Bailey",
  description: siteDescription,
  alternates: {
    canonical: "/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
