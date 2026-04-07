import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

// iOS home-screen icon — "The Virtuoso" (Jhin-inspired)
// Theatrical oxblood stage. Carnation-pink footlight glow rising from below.
// Ivory porcelain "G" with a vertical gold spine — a nod to Jhin's mask.
// Four gold corner diamonds (everything in fours). Hairline gold proscenium
// frame. Cinzel Black, operatic and sharp.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const cinzelBlack = await readFile(
    path.join(process.cwd(), "public/fonts/Cinzel-Black.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background:
            "radial-gradient(circle at 50% 14%, #4a0a18 0%, #260610 38%, #0d0206 100%)",
        }}
      >
        {/* Footlight glow rising from the bottom — Curtain Call lotus */}
        <div
          style={{
            position: "absolute",
            left: -20,
            right: -20,
            bottom: -40,
            height: 180,
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255, 60, 130, 0.65) 0%, rgba(255, 30, 100, 0.35) 30%, rgba(180, 10, 60, 0.15) 55%, rgba(0,0,0,0) 78%)",
            display: "flex",
          }}
        />

        {/* Outer hairline gold proscenium ring */}
        <div
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: 38,
            border: "1.5px solid rgba(232, 196, 110, 0.65)",
            boxShadow: "inset 0 0 0 1px rgba(255, 220, 140, 0.20)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: 32,
            border: "1px solid rgba(232, 196, 110, 0.14)",
            display: "flex",
          }}
        />

        {/* Four gold corner diamonds — Jhin's obsession with 4 */}
        {[
          { top: 18, left: 18 },
          { top: 18, right: 18 },
          { bottom: 18, left: 18 },
          { bottom: 18, right: 18 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 6,
              height: 6,
              background:
                "linear-gradient(135deg, #f6d97a 0%, #c78b2c 100%)",
              transform: "rotate(45deg)",
              boxShadow: "0 0 6px rgba(255, 210, 110, 0.85)",
              display: "flex",
            }}
          />
        ))}

        {/* Vertical gold spine behind the G — the mask stripe */}
        <div
          style={{
            position: "absolute",
            top: 18,
            bottom: 18,
            width: 14,
            background:
              "linear-gradient(180deg, rgba(255,220,130,0) 0%, rgba(255,210,110,0.55) 18%, rgba(255,225,140,0.85) 50%, rgba(255,210,110,0.55) 82%, rgba(255,220,130,0) 100%)",
            display: "flex",
          }}
        />

        {/* Pink halo concentrated right behind the letter */}
        <div
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 80, 140, 0.55) 0%, rgba(255, 40, 110, 0.28) 35%, rgba(0,0,0,0) 72%)",
            display: "flex",
          }}
        />
        {/* Tight ivory core glow under the G */}
        <div
          style={{
            position: "absolute",
            width: 92,
            height: 92,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 235, 200, 0.55) 0%, rgba(255, 200, 150, 0.25) 50%, rgba(0,0,0,0) 80%)",
            display: "flex",
          }}
        />

        {/* The G — ivory porcelain, gold-edged, pink-haloed */}
        <div
          style={{
            fontFamily: "CinzelBlack",
            fontWeight: 900,
            fontSize: 156,
            color: "#f6e9d2",
            lineHeight: 1,
            marginTop: -6,
            display: "flex",
            textShadow: [
              "0 0 1px #d4a85a",
              "0 1px 0 #b88838",
              "0 0 14px rgba(255, 80, 140, 0.85)",
              "0 0 30px rgba(255, 40, 110, 0.65)",
              "0 0 54px rgba(255, 20, 90, 0.40)",
              "0 3px 0 rgba(40, 4, 14, 0.65)",
            ].join(", "),
          }}
        >
          G
        </div>

        {/* Top sheen — soft proscenium light */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            background:
              "linear-gradient(180deg, rgba(255,210,140,0.10) 0%, rgba(255,255,255,0) 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "CinzelBlack",
          data: cinzelBlack,
          style: "normal",
          weight: 900,
        },
      ],
    },
  );
}
