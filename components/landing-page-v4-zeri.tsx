"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { coverContent } from "@/lib/home";
import { getLocalizedText } from "@/lib/site";

export function LandingPageV4Zeri() {
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (splashRef.current) {
        splashRef.current.style.transform = `translate(${x * 6}px, ${y * 4}px) scale(1.02)`;
      }
    };
    const onLeave = () => {
      if (splashRef.current) splashRef.current.style.transform = "translate(0,0) scale(1.02)";
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
    <div
      className={`v4-root${revealed ? " v4-root--revealed" : ""}`}
      ref={stageRef}
      style={{
        backgroundImage: `url('/media/images/hero.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="v4-bg-energy" aria-hidden="true" />
      <div className="v4-electric-lines" aria-hidden="true" />
      <div className="v4-vignette" aria-hidden="true" />

      <audio ref={audioRef} src="/media/reels/intro-demo-reel.mp3" preload="metadata" />

      <div className="v4-accent-lines" aria-hidden="true">
        <div className="v4-line v4-line--top" />
        <div className="v4-line v4-line--bottom" />
        <div className="v4-line v4-line--left" />
        <div className="v4-line v4-line--right" />
      </div>

      <div className="v4-hero-container">
        <div className="v4-identity">
          <div className="v4-tag" aria-hidden="true">&lt; / &gt;</div>
          <h1 className="v4-name">JORDAN BAILEY</h1>
          <div className="v4-pulse-line" aria-hidden="true" />
          <p className="v4-title">{getLocalizedText({ en: "VOLTAGE VOICE", de: "SPANNUNGSSTIMME" }, locale)}</p>
        </div>

        <div className="v4-actions">
          <button
            type="button"
            className={`v4-btn-primary${playing ? " v4-btn-primary--charged" : ""}`}
            onClick={toggleAudio}
            aria-label={playing ? "Pause" : "Play"}
          >
            <span className="v4-btn-spark" aria-hidden="true">⚡</span>
            <span className="v4-btn-text">{getLocalizedText({ en: "POWER UP", de: "HOCHFAHREN" }, locale)}</span>
          </button>

          <Link href="/book" className="v4-btn-secondary">
            <span className="v4-btn-spark" aria-hidden="true">→</span>
            <span className="v4-btn-text">{getLocalizedText({ en: "GO FAST", de: "LOS GEHT'S" }, locale)}</span>
          </Link>
        </div>
      </div>

      {/* Compact Pill Player - Top Right */}
      <div
        className="v4-compact-player"
        onMouseEnter={() => setShowPlayer(true)}
        onMouseLeave={() => setShowPlayer(false)}
      >
        <button
          type="button"
          className={`v4-compact-button${playing ? " v4-compact-button--playing" : ""}`}
          onClick={toggleAudio}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "⚡"}
        </button>

        {showPlayer && (
          <div className="v4-compact-panel">
            <div className="v4-compact-bar" style={{ width: `${progressPercent}%` }} />
            <div className="v4-compact-time">{formatTime(currentTime)}</div>
          </div>
        )}
      </div>

      <div className="v4-bio">
        <p>{getLocalizedText(coverContent.eyebrow, locale)}</p>
      </div>
    </div>
  );
}
