"use client";

import { useState } from "react";
import { LandingPageV1Hextech } from "./landing-page-v1-hextech";
import { LandingPageV2Cinematic } from "./landing-page-v2-cinematic";
import { LandingPageV3Jhin } from "./landing-page-v3-jhin";
import { LandingPageV4Zeri } from "./landing-page-v4-zeri";

export function LandingPage() {
  const [version, setVersion] = useState<"v1" | "v2" | "v3" | "v4">("v2");

  const buttonConfigs = [
    { id: "v1", label: "COMMERCIAL", color: "#c89b3c" },
    { id: "v2", label: "CINEMATIC", color: "#0bc4e3" },
    { id: "v3", label: "PRECISE", color: "#a0643c" },
    { id: "v4", label: "SCHNELL", color: "#8a2be2" },
  ];

  return (
    <>
      {version === "v1" && <LandingPageV1Hextech />}
      {version === "v2" && <LandingPageV2Cinematic />}
      {version === "v3" && <LandingPageV3Jhin />}
      {version === "v4" && <LandingPageV4Zeri />}

      {/* Design Toggle Buttons - Top Left (Iteration 1: Minimal Bar) */}
      <div
        style={{
          position: "fixed",
          top: "2rem",
          left: "2rem",
          zIndex: 9999,
          display: "flex",
          gap: "0.4rem",
          flexWrap: "nowrap",
          background: "rgba(5, 7, 18, 0.85)",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid rgba(200, 155, 60, 0.3)",
          backdropFilter: "blur(4px)",
        }}
      >
        {buttonConfigs.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setVersion(btn.id as "v1" | "v2" | "v3" | "v4")}
            style={{
              background: version === btn.id ? btn.color : "transparent",
              border: `1px solid ${btn.color}`,
              color: version === btn.id ? (btn.id === "v4" ? "#e0ff41" : "#000") : btn.color,
              padding: "0.25rem 0.6rem",
              cursor: "pointer",
              fontSize: "0.5rem",
              fontFamily: "Georgia, 'Garamond', serif",
              fontWeight: version === btn.id ? "bold" : "600",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.2s",
              borderRadius: "2px",
              boxShadow: version === btn.id ? `0 0 8px ${btn.color}66` : "none",
              whiteSpace: "nowrap",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </>
  );
}
