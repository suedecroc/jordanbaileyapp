"use client";

import { useState } from "react";

function MockLayout({ layout, title, viewport }: { layout: "a" | "b" | "c"; title: string; viewport: "mobile" | "desktop" }) {
  return (
    <div
      style={{
        background: "linear-gradient(rgba(5,7,18,0.3), rgba(5,7,18,0.3)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 600\"><rect fill=\"%23654321\" width=\"400\" height=\"600\"/><circle cx=\"200\" cy=\"250\" r=\"90\" fill=\"%238B7355\" opacity=\"0.4\"/></svg>')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
        border: "2px solid rgba(11, 196, 227, 0.3)",
        padding: "2rem",
        minHeight: viewport === "mobile" ? "600px" : "800px",
        display: "flex",
        flexDirection: "column",
        justifyContent: layout === "c" ? "flex-end" : "center",
        alignItems: "center",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Title above */}
      <div style={{ position: "absolute", top: "1rem", left: "1rem", fontSize: "0.85rem", color: "#0bc4e3" }}>
        {title}
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
          width: "100%",
          padding: layout === "b" ? "2rem" : "0",
          background: layout === "b" ? "rgba(5, 7, 18, 0.7)" : "transparent",
          border: layout === "b" ? "1px solid rgba(11, 196, 227, 0.2)" : "none",
          borderRadius: layout === "b" ? "4px" : "0px",
          backdropFilter: layout === "b" ? "blur(12px)" : "none",
          boxShadow: layout === "b" ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "none",
        }}
      >
        {/* Name */}
        <h1
          style={{
            fontSize: viewport === "mobile" ? "1.6rem" : "2.4rem",
            fontWeight: 900,
            letterSpacing: "0.15em",
            color: "#c89b3c",
            margin: 0,
            fontFamily: "Georgia, serif",
            textShadow: "0 0 30px rgba(200, 155, 60, 0.3), 0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          JORDAN BAILEY
        </h1>

        {/* Title */}
        <p
          style={{
            fontSize: viewport === "mobile" ? "0.85rem" : "1rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#0bc4e3",
            margin: 0,
            fontFamily: "Georgia, serif",
            fontWeight: 600,
          }}
        >
          Voice Actor
        </p>

        {/* Tagline */}
        <p
          style={{
            fontSize: viewport === "mobile" ? "0.7rem" : "0.85rem",
            letterSpacing: "0.05em",
            lineHeight: 1.6,
            color: "rgba(232, 216, 176, 0.85)",
            maxWidth: viewport === "mobile" ? "90vw" : "400px",
            textAlign: "center",
            margin: 0,
          }}
        >
          Voice actor / English + German / Games, Animation, Commercial
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: layout === "b" ? "row" : viewport === "mobile" ? "column" : "row",
            width: layout === "b" || viewport === "mobile" ? "100%" : "auto",
            marginTop: "0.5rem",
          }}
        >
          <button
            style={{
              padding: "0.9rem 1.6rem",
              border: "2px solid #c89b3c",
              background: "rgba(200, 155, 60, 0.18)",
              color: "#c89b3c",
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0 20px rgba(200, 155, 60, 0.25), inset 0 0 20px rgba(200, 155, 60, 0.05)",
              backdropFilter: "blur(8px)",
              borderRadius: "2px",
              flex: layout === "b" || viewport === "mobile" ? 1 : "auto",
              minHeight: "48px",
            }}
          >
            ▶ Listen First
          </button>
          <button
            style={{
              padding: "0.9rem 1.6rem",
              border: "2px solid #c89b3c",
              background: "rgba(200, 155, 60, 0.18)",
              color: "#c89b3c",
              fontFamily: "Georgia, serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0 20px rgba(200, 155, 60, 0.25), inset 0 0 20px rgba(200, 155, 60, 0.05)",
              backdropFilter: "blur(8px)",
              borderRadius: "2px",
              flex: layout === "b" || viewport === "mobile" ? 1 : "auto",
              minHeight: "48px",
            }}
          >
            📖 Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  const [viewport, setViewport] = useState<"mobile" | "desktop">("mobile");

  return (
    <div style={{ background: "#06080f", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Controls */}
        <div style={{ marginBottom: "2rem", display: "flex", gap: "2rem" }}>
          <div>
            <label style={{ marginRight: "1rem", fontWeight: "bold" }}>Viewport:</label>
            {["mobile", "desktop"].map((v) => (
              <button
                key={v}
                onClick={() => setViewport(v as "mobile" | "desktop")}
                style={{
                  marginRight: "1rem",
                  padding: "0.6rem 1.2rem",
                  background: viewport === v ? "#0bc4e3" : "#333",
                  color: viewport === v ? "#000" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  borderRadius: "4px",
                }}
              >
                {v === "mobile" ? "Mobile (375px)" : "Desktop (1200px)"}
              </button>
            ))}
          </div>
        </div>

        {/* Layouts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: viewport === "mobile" ? "1fr" : "repeat(3, 1fr)",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#0bc4e3" }}>LAYOUT A: Centered (Current)</h3>
            <MockLayout layout="a" title="A: CENTERED" viewport={viewport} />
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#ccc" }}>
              ✓ Clean, minimal<br />
              ✓ Text & buttons centered<br />
              ✓ Classic balance
            </p>
          </div>

          <div>
            <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#0bc4e3" }}>LAYOUT B: Card Overlay</h3>
            <MockLayout layout="b" title="B: CARD" viewport={viewport} />
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#ccc" }}>
              ✓ Dark glass panel<br />
              ✓ Contained, professional<br />
              ✓ Buttons side-by-side (desktop)
            </p>
          </div>

          <div>
            <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#0bc4e3" }}>LAYOUT C: Bottom-Positioned</h3>
            <MockLayout layout="c" title="C: BOTTOM" viewport={viewport} />
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#ccc" }}>
              ✓ Info at bottom<br />
              ✓ Maximizes face visibility<br />
              ✓ Modern, bold
            </p>
          </div>
        </div>

        <div style={{ background: "rgba(11, 196, 227, 0.1)", padding: "1.5rem", borderRadius: "4px", marginTop: "2rem" }}>
          <h3>Recommendation</h3>
          <p>
            <strong>Layout A (Current)</strong> is clean and balanced. <br />
            <strong>Layout B</strong> is great for desktop with the card effect, but on mobile the full-width card takes up too much space. <br />
            <strong>Layout C</strong> shows more of your hero image on mobile, which is great for visual impact.
          </p>
          <p>
            <strong>My pick:</strong> Layout A for consistency across both mobile/desktop, or mix: <strong>Layout A on mobile + Layout B on desktop</strong> for the best of both worlds.
          </p>
        </div>
      </div>
    </div>
  );
}
