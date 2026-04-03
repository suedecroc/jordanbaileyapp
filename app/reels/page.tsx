import type { Metadata } from "next";

import { ReelsPage } from "@/components/reels-page";

export const metadata: Metadata = {
  title: "The Work",
  description: "Commercial, cinematic, narration, promo, and character reels from Jordan Bailey.",
  alternates: {
    canonical: "/reels",
  },
};

export default function Page() {
  return <ReelsPage />;
}
