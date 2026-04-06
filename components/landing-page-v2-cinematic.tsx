"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { coverContent } from "@/lib/home";
import { getLocalizedText } from "@/lib/site";

export function LandingPageV2Cinematic() {
  const { locale } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
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
        splashRef.current.style.transform = `translate(${x * 10}px, ${y * 6}px) scale(1.04)`;
      }
    };
    const onLeave = () => {
      if (splashRef.current) splashRef.current.style.transform = "translate(0,0) scale(1.04)";
    };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function formatTime(seconds: number) {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`v2-root${revealed ? " v2-root--revealed" : ""}`} ref={stageRef}>
      {/* Ambient */}
      <div className="v2-bg-hex" aria-hidden="true" />
      <div className="v2-particles" aria-hidden="true" />
      <div className="v2-scanline" aria-hidden="true" />
      <div className="v2-vignette" aria-hidden="true" />

      {/* Audio (hidden) */}
      <audio ref={audioRef} src="/media/reels/intro-demo-reel.mp3" preload="metadata" />

      {/* Hero Frame - Minimal Border, Maximum Impact */}
      <div className="v2-hero-container">
        <div className="v2-hero-frame">
          <div className="v2-hero-image" ref={splashRef}>
            <img src="/media/images/hero.webp" alt="Jordan Bailey" draggable={false} />
            <div className="v2-hero-overlay" aria-hidden="true" />
          </div>
          <div className="v2-hero-border" aria-hidden="true" />
        </div>

        {/* Text Overlay - Minimal */}
        <div className="v2-text-overlay">
          <h1 className="v2-name">JORDAN BAILEY</h1>
          <p className="v2-subtitle">
            {getLocalizedText({ en: "Voice Actor", de: "Sprecher" }, locale)}
          </p>
        </div>

        {/* Action Buttons - Right Side / Responsive */}
        <div className="v2-actions">
          <button
            type="button"
            className={`v2-btn-primary${playing ? " v2-btn-primary--playing" : ""}`}
            onClick={toggleAudio}
            aria-label={playing ? "Pause demo reel" : "Play demo reel"}
          >
            <span className="v2-btn-icon">{playing ? "⏸" : "▶"}</span>
            <span className="v2-btn-text">
              {getLocalizedText({ en: "Listen First", de: "Erst hören" }, locale)}
            </span>
          </button>

          <Link href="/book" className="v2-btn-secondary">
            <span className="v2-btn-icon">↳</span>
            <span className="v2-btn-text">
              {getLocalizedText({ en: "Book Now", de: "Jetzt buchen" }, locale)}
            </span>
          </Link>
        </div>
      </div>

      {/* Compact Pill Player - Top Right */}
      <div
        className="v2-compact-player"
        onMouseEnter={() => setShowPlayer(true)}
        onMouseLeave={() => setShowPlayer(false)}
      >
        <button
          type="button"
          className={`v2-compact-button${playing ? " v2-compact-button--playing" : ""}`}
          onClick={toggleAudio}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>

        {showPlayer && (
          <div className="v2-compact-panel">
            <div className="v2-compact-bar" style={{ width: `${progressPercent}%` }} />
            <div className="v2-compact-time">{formatTime(currentTime)}</div>
          </div>
        )}
      </div>

      {/* Tagline - Bottom Center */}
      <div className="v2-tagline">
        <p>{getLocalizedText(coverContent.eyebrow, locale)}</p>
      </div>
    </div>
  );
}
