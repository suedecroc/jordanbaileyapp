import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { LanguageProvider } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/media/images/hero.webp",
        width: 1200,
        height: 1600,
        alt: "Jordan Bailey portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/media/images/hero.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <LanguageProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-24 sm:pt-28">{children}</main>
            <SiteFooter />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
