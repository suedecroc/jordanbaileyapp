export const metadata = {
  title: "Jordan Bailey | Voiceover. Storytelling. Presence.",
  description:
    "Official site for Jordan Bailey — voiceover artist, storyteller, and creative presence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0a", color: "#ffffff" }}>
        {children}
      </body>
    </html>
  );
}
