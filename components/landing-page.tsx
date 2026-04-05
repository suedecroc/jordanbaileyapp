"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { coverContent } from "@/lib/home";
import { contactDetails, getLocalizedText } from "@/lib/site";


const loreCards = [
  {
    label: { en: "Origin", de: "Herkunft" },
    value: { en: "Frankfurt → Atlanta", de: "Frankfurt → Atlanta" },
  },
  {
    label: { en: "Languages", de: "Sprachen" },
    value: { en: "English / German", de: "Englisch / Deutsch" },
  },
  {
    label: { en: "Tier", de: "Tier" },
    value: { en: "Tier 3 Operations Engineer", de: "Tier 3 Operations Engineer" },
  },
  {
    label: { en: "Class", de: "Klasse" },
    value: { en: "Voice Actor", de: "Sprecher" },
  },
];

export function LandingPage() {
  const { locale } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  // Entrance reveal
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Parallax on mouse move
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (splashRef.current) {
        splashRef.current.style.transform = `translate(${x * 14}px, ${y * 9}px) scale(1.06)`;
      }
      if (floatRef.current) {
        floatRef.current.style.transform = `translate(${x * -8}px, ${y * -5}px)`;
      }
    };

    const onLeave = () => {
      if (splashRef.current) {
        splashRef.current.style.transform = "translate(0,0) scale(1.06)";
      }
      if (floatRef.current) {
        floatRef.current.style.transform = "translate(0,0)";
      }
    };

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className={`cs-root${revealed ? " cs-root--revealed" : ""}`} ref={stageRef}>
      {/* Ambient layers */}
      <div className="cs-bg-hex" aria-hidden="true" />
      <div className="cs-particles" aria-hidden="true" />
      <div className="cs-scanline" aria-hidden="true" />
      <div className="cs-vignette" aria-hidden="true" />

      {/* === LEFT PANEL === */}
      <aside className="cs-panel cs-panel--left">
        <div className="cs-panel__cap cs-panel__cap--top" aria-hidden="true" />

        <header className="cs-panel__head">
          <span className="cs-label">SPECIALIZATIONS</span>
        </header>

        <div className="cs-lore-grid">
          {loreCards.map((c) => (
            <div key={c.label.en} className="cs-lore-card">
              <span className="cs-lore-card__label">{getLocalizedText(c.label, locale)}</span>
              <span className="cs-lore-card__value">{getLocalizedText(c.value, locale)}</span>
            </div>
          ))}
        </div>

        <div className="cs-panel__divider" aria-hidden="true" />

        <div className="cs-lang-wrap">
          <LanguageToggle className="cs-lang" />
        </div>

        <div className="cs-panel__cap cs-panel__cap--bot" aria-hidden="true" />
      </aside>

      {/* === CENTER STAGE === */}
      <main className="cs-center">
        {/* Splash */}
        <div className="cs-splash-frame">
          <div className="cs-splash-img" ref={splashRef}>
            <img
              src="/media/images/hero.webp"
              alt="Jordan Bailey"
              draggable={false}
            />
          </div>
          <div className="cs-splash-veil" aria-hidden="true" />
          <div className="cs-splash-rim" aria-hidden="true" />

          {/* Floating ornament layer */}
          <div className="cs-float-layer" ref={floatRef} aria-hidden="true">
            <div className="cs-ornament cs-ornament--tl" />
            <div className="cs-ornament cs-ornament--tr" />
            <div className="cs-ornament cs-ornament--bl" />
            <div className="cs-ornament cs-ornament--br" />
            <div className="cs-hex-ring cs-hex-ring--outer" />
            <div className="cs-hex-ring cs-hex-ring--inner" />
          </div>
        </div>

        {/* Nameplate */}
        <div className="cs-nameplate">
          <p className="cs-nameplate__eyebrow">
            {getLocalizedText(coverContent.eyebrow, locale)}
          </p>
          <div className="cs-nameplate__divider" aria-hidden="true">
            <span />
            <span className="cs-nameplate__roman">I</span>
            <span />
          </div>
          <h1 className="cs-nameplate__name">Jordan Bailey</h1>
          <p className="cs-nameplate__title">
            {getLocalizedText({ en: "The Voice Actor", de: "Der Sprecher" }, locale)}
          </p>
        </div>

        {/* Lock-in */}
        <div className="cs-action-bar">
          <Link href="/home" className="cs-lock-in">
            <span className="cs-lock-in__glow" aria-hidden="true" />
            <span className="cs-lock-in__label">
              {getLocalizedText({ en: "ENTER", de: "EINTRETEN" }, locale)}
            </span>
            <span className="cs-lock-in__sub">
              {getLocalizedText({ en: "Step into Act I", de: "Tritt in Akt I ein" }, locale)}
            </span>
          </Link>
        </div>
      </main>

      {/* === RIGHT PANEL === */}
      <aside className="cs-panel cs-panel--right">
        <div className="cs-panel__cap cs-panel__cap--top" aria-hidden="true" />

        <header className="cs-panel__head">
          <span className="cs-label">CHAMPION LORE</span>
        </header>

        <div className="cs-lore-body">
          <p className="cs-lore-text">
            {getLocalizedText(coverContent.body, locale)}
          </p>
          <blockquote className="cs-epigraph">
            In carnage, I bloom, like a flower in the dawn
          </blockquote>
        </div>

        <div className="cs-panel__divider" aria-hidden="true" />

        <div className="cs-cta-wrap">
          <Link href="/book" className="cs-book-btn">
            <span>BOOK THIS CHAMPION</span>
          </Link>
          <a href={contactDetails.emailHref} className="cs-inquiry-link">
            {getLocalizedText({ en: "Send Inquiry", de: "Anfrage senden" }, locale)}
          </a>
        </div>

        <div className="cs-panel__cap cs-panel__cap--bot" aria-hidden="true" />
      </aside>
    </div>
  );
}
