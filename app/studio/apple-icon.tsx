import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

// iOS home-screen icon size
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Static generation: this runs at build time, baked into the deploy.
export default async function AppleIcon() {
  // Read Abril Fatface from /public/fonts at build time. Satori (the engine
  // behind ImageResponse) only accepts TTF/OTF, so we ship the .ttf directly
  // rather than fighting Google Fonts' woff2 defaults.
  const abrilFont = await readFile(
    path.join(process.cwd(), "public/fonts/AbrilFatface-Regular.ttf"),
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
          background:
            "radial-gradient(circle at 50% 35%, #ff7a1f 0%, #b81c05 45%, #1c0707 100%)",
          position: "relative",
        }}
      >
        {/* Inner ring of bulbs vibe */}
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: 30,
            border: "3px solid #ffb020",
            boxShadow: "inset 0 0 28px rgba(255, 176, 32, 0.45)",
            display: "flex",
          }}
        />
        {/* The G */}
        <div
          style={{
            fontFamily: "Abril",
            fontSize: 150,
            color: "#ffd23f",
            lineHeight: 1,
            marginTop: -8,
            textShadow:
              "0 0 18px rgba(255, 210, 63, 0.65), 0 0 4px rgba(255, 106, 19, 0.9)",
          }}
        >
          G
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Abril",
          data: abrilFont,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
