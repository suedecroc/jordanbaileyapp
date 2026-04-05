import type { Metadata } from "next";

import { HomePage } from "@/components/home-page";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "Act I",
  description: siteDescription,
  alternates: {
    canonical: "/home",
  },
};

export default function Page() {
  return <HomePage />;
}
