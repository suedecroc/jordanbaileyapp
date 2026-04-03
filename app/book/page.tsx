import type { Metadata } from "next";

import { BookPage } from "@/components/book-page";

export const metadata: Metadata = {
  title: "Book Jordan",
  description: "Give Jordan Bailey the details. If it is a fit, the work moves quickly.",
  alternates: {
    canonical: "/book",
  },
};

export default function Page() {
  return <BookPage />;
}
