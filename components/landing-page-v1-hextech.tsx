"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { coverContent } from "@/lib/home";
import { getLocalizedText } from "@/lib/site";

export function LandingPageV1Hextech() {
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
        splashRef.current.style.transform = `translate(${x * 12}px, ${y * 8}px) scale(1.05)`;
      }
    };
    const onLeave = () => {
      if (splashRef.current) splashRef.current.style.transform = "translate(0,0) scale(1.05)";
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
    <div className={`v1-root${revealed ? " v1-root--revealed" : ""}`} ref={stageRef}>
      {/* Ambient */}
      <div className="v1-bg-hex" aria-hidden="true" />
      <div className="v1-particles" aria-hidden="true" />
      <div className="v1-scanline" aria-hidden="true" />
      <div className="v1-vignette" aria-hidden="true" />

      {/* Audio (hidden) */}
      <audio ref={audioRef} src="/media/reels/intro-demo-reel.mp3" preload="metadata" />

      {/* Hero Frame Container */}
      <div className="v1-hero-container">
        {/* Outer Gold Border */}
        <div className="v1-hero-outer-frame">
          {/* Inner Cyan Glow */}
          <div className="v1-hero-inner-frame">
            {/* Hero Image */}
            <div className="v1-hero-image" ref={splashRef}>
              <img src="/media/images/hero.webp" alt="Jordan Bailey" draggable={false} />
              <div className="v1-hero-veil" aria-hidden="true" />
            </div>

            {/* Corner Ornaments */}
            <div className="v1-corner-ornament v1-corner-ornament--tl" aria-hidden="true" />
            <div className="v1-corner-ornament v1-corner-ornament--tr" aria-hidden="true" />
            <div className="v1-corner-ornament v1-corner-ornament--bl" aria-hidden="true" />
            <div className="v1-corner-ornament v1-corner-ornament--br" aria-hidden="true" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="v1-actions">
          <button
            type="button"
            className={`v1-btn-listen${playing ? " v1-btn-listen--playing" : ""}`}
            onClick={toggleAudio}
            aria-label={playing ? "Pause demo reel" : "Play demo reel"}
          >
            <span className="v1-btn-listen__icon" aria-hidden="true">
              {playing ? "⏸" : "▶"}
            </span>
            <span className="v1-btn-listen__label">
              {getLocalizedText({ en: "Listen First", de: "Erst hören" }, locale)}
            </span>
          </button>

          <Link href="/book" className="v1-btn-book">
            {getLocalizedText({ en: "Book Now", de: "Jetzt buchen" }, locale)}
          </Link>
        </div>
      </div>

      {/* Compact Pill Player - Top Right */}
      <div
        className="v1-compact-player"
        onMouseEnter={() => setShowPlayer(true)}
        onMouseLeave={() => setShowPlayer(false)}
      >
        <button
          type="button"
          className={`v1-compact-button${playing ? " v1-compact-button--playing" : ""}`}
          onClick={toggleAudio}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>

        {showPlayer && (
          <div className="v1-compact-panel">
            <div className="v1-compact-bar" style={{ width: `${progressPercent}%` }} />
            <div className="v1-compact-time">{formatTime(currentTime)}</div>
          </div>
        )}
      </div>

      {/* Name & Info Card */}
      <div className="v1-info-card">
        <h1 className="v1-name">Jordan Bailey</h1>
        <p className="v1-title">
          {getLocalizedText({ en: "Voice Actor", de: "Sprecher" }, locale)}
        </p>
        <p className="v1-tagline">
          {getLocalizedText(coverContent.eyebrow, locale)}
        </p>
      </div>
    </div>
  );
}
