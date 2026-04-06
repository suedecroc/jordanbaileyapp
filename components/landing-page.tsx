"use client";

import { useState } from "react";
import { LandingPageV1Hextech } from "./landing-page-v1-hextech";
import { LandingPageV2Cinematic } from "./landing-page-v2-cinematic";
import { LandingPageV3Jhin } from "./landing-page-v3-jhin";
import { LandingPageV4Zeri } from "./landing-page-v4-zeri";

export function LandingPage() {
  const [version, setVersion] = useState<"v1" | "v2" | "v3" | "v4">("v2");

  return (
    <>
      {version === "v1" && <LandingPageV1Hextech />}
      {version === "v2" && <LandingPageV2Cinematic />}
      {version === "v3" && <LandingPageV3Jhin />}
      {version === "v4" && <LandingPageV4Zeri />}

      {/* Version Toggle (top-left) */}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 9999,
          background: "rgba(0,0,0,0.9)",
          padding: "0.8rem 1.2rem",
          border: "1px solid #0bc4e3",
          borderRadius: "4px",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.65rem",
          color: "#0bc4e3",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ marginBottom: "0.6rem", fontWeight: "bold" }}>Landing Page Design</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
          <button
            type="button"
            onClick={() => setVersion("v1")}
            style={{
              background: version === "v1" ? "#c89b3c" : "transparent",
              border: "1px solid " + (version === "v1" ? "#f0e0a0" : "#c89b3c"),
              color: version === "v1" ? "#000" : "#c89b3c",
              padding: "0.4rem 0.6rem",
              cursor: "pointer",
              fontSize: "0.6rem",
              transition: "all 0.2s",
              fontWeight: version === "v1" ? "bold" : "normal",
            }}
          >
            Hextech
          </button>
          <button
            type="button"
            onClick={() => setVersion("v2")}
            style={{
              background: version === "v2" ? "#0bc4e3" : "transparent",
              border: "1px solid #0bc4e3",
              color: version === "v2" ? "#000" : "#0bc4e3",
              padding: "0.4rem 0.6rem",
              cursor: "pointer",
              fontSize: "0.6rem",
              transition: "all 0.2s",
              fontWeight: version === "v2" ? "bold" : "normal",
            }}
          >
            Cinematic
          </button>
          <button
            type="button"
            onClick={() => setVersion("v3")}
            style={{
              background: version === "v3" ? "#a0643c" : "transparent",
              border: "1px solid #a0643c",
              color: version === "v3" ? "#fff" : "#a0643c",
              padding: "0.4rem 0.6rem",
              cursor: "pointer",
              fontSize: "0.6rem",
              transition: "all 0.2s",
              fontWeight: version === "v3" ? "bold" : "normal",
            }}
          >
            Jhin
          </button>
          <button
            type="button"
            onClick={() => setVersion("v4")}
            style={{
              background: version === "v4" ? "#8a2be2" : "transparent",
              border: "1px solid #8a2be2",
              color: version === "v4" ? "#e0ff41" : "#8a2be2",
              padding: "0.4rem 0.6rem",
              cursor: "pointer",
              fontSize: "0.6rem",
              transition: "all 0.2s",
              fontWeight: version === "v4" ? "bold" : "normal",
            }}
          >
            Zeri
          </button>
        </div>
      </div>
    </>
  );
}
