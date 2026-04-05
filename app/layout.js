""
import "./globals.css";

export const metadata = {
  title: "Jordan Bailey | Voice Actor | English + German",
  description:
    "Jordan Bailey is a voice actor for commercial, character, animation, cinematic, and business-facing work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
""