import type { Metadata } from "next";

import { LandingPage } from "@/components/landing-page";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "Jordan Bailey",
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <LandingPage />;
}
