"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { coverContent } from "@/lib/home";
import { getLocalizedText } from "@/lib/site";

export function LandingPageV3Jhin() {
  const { locale } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 120);
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !scopeRef.current) return;

    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (splashRef.current) {
        splashRef.current.style.transform = `translate(${x * 8}px, ${y * 5}px) scale(1.03)`;
      }
      if (scopeRef.current) {
        scopeRef.current.style.transform = `translate(${x * 16}px, ${y * 16}px)`;
      }
    };
    const onLeave = () => {
      if (splashRef.current) splashRef.current.style.transform = "translate(0,0) scale(1.03)";
      if (scopeRef.current) scopeRef.current.style.transform = "translate(0,0)";
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
    <div className={`v3-root${revealed ? " v3-root--revealed" : ""}`} ref={stageRef}>
      <div className="v3-bg-gradient" aria-hidden="true" />
      <div className="v3-mist" aria-hidden="true" />
      <div className="v3-vignette" aria-hidden="true" />

      <audio ref={audioRef} src="/media/reels/intro-demo-reel.mp3" preload="metadata" />

      <div className="v3-scope" ref={scopeRef} aria-hidden="true">
        <div className="v3-scope-outer" />
        <div className="v3-scope-inner" />
        <div className="v3-scope-crosshair" />
        <div className="v3-scope-line v3-scope-line--h" />
        <div className="v3-scope-line v3-scope-line--v" />
      </div>

      <div className="v3-hero-container">
        <div className="v3-target-frame">
          <div className="v3-frame-accent v3-frame-accent--gold" aria-hidden="true" />
          <div className="v3-frame-accent v3-frame-accent--red" aria-hidden="true" />

          <div className="v3-hero-image" ref={splashRef}>
            <img src="/media/images/hero.webp" alt="Jordan Bailey" draggable={false} />
            <div className="v3-hero-glow" aria-hidden="true" />
          </div>

          <div className="v3-frame-border" aria-hidden="true" />
          <div className="v3-corner-markers" aria-hidden="true">
            <span className="v3-marker v3-marker--tl" />
            <span className="v3-marker v3-marker--tr" />
            <span className="v3-marker v3-marker--bl" />
            <span className="v3-marker v3-marker--br" />
          </div>
        </div>

        <div className="v3-precision-info">
          <h1 className="v3-callsign">JORDAN BAILEY</h1>
          <div className="v3-info-divider" aria-hidden="true" />
          <p className="v3-role">{getLocalizedText({ en: "Voice Sniper", de: "Stimmen Präzision" }, locale)}</p>
        </div>

        <div className="v3-actions">
          <button
            type="button"
            className={`v3-btn-primary${playing ? " v3-btn-primary--active" : ""}`}
            onClick={toggleAudio}
            aria-label={playing ? "Pause" : "Play"}
          >
            <span className="v3-btn-crosshair" aria-hidden="true">⊕</span>
            <span className="v3-btn-text">{getLocalizedText({ en: "ACQUIRE TARGET", de: "ZIEL ERFASSEN" }, locale)}</span>
          </button>

          <Link href="/book" className="v3-btn-secondary">
            <span className="v3-btn-crosshair" aria-hidden="true">⊲</span>
            <span className="v3-btn-text">{getLocalizedText({ en: "LOCK IN", de: "FEST EINGESTELLT" }, locale)}</span>
          </Link>
        </div>
      </div>

      <div className="v3-precision-player">
        <div className="v3-player-reticle" aria-hidden="true" />
        <button type="button" className={`v3-player-trigger${playing ? " v3-player-trigger--firing" : ""}`} onClick={toggleAudio} aria-label={playing ? "Pause" : "Play"}>
          {playing ? "⏸" : "▶"}
        </button>
        <div className="v3-player-barrel" aria-hidden="true" />
        <div className="v3-player-ammo" style={{ width: `${progressPercent}%` }} />
        <div className="v3-player-time">{formatTime(currentTime)}</div>
      </div>

      <div className="v3-range-info">
        <p>{getLocalizedText(coverContent.eyebrow, locale)}</p>
      </div>
    </div>
  );
}
