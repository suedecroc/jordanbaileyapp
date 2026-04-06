"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

export function FloatingIntroPlayerV4() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="cs-reel-card">
      <audio
        ref={audioRef}
        src="/media/intro-demo-reel.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header */}
      <div className="cs-reel-header">
        <span className="cs-reel-eyebrow">INTRO DEMO REEL</span>
        <div
          className={`cs-reel-waves${isPlaying ? " cs-reel-waves--active" : ""}`}
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="cs-reel-wave-bar" />
          ))}
        </div>
      </div>

      {/* Player row */}
      <div className="cs-reel-player-row">
        <button
          className="cs-reel-play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <span className="cs-reel-play-glow" aria-hidden="true" />
          {isPlaying ? (
            <Pause className="cs-reel-play-icon" />
          ) : (
            <Play className="cs-reel-play-icon cs-reel-play-icon--offset" />
          )}
        </button>

        <div className="cs-reel-track">
          <div className="cs-reel-progress-bar">
            <div
              className="cs-reel-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="cs-reel-time">
            {fmtTime(currentTime)} / {fmtTime(duration)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="cs-reel-divider" aria-hidden="true" />

      {/* CTAs */}
      <div className="cs-reel-ctas">
        <button
          className="cs-reel-btn cs-reel-btn--primary"
          onClick={togglePlay}
        >
          Listen First
        </button>
        <a
          href="mailto:jrdnbailey23@gmail.com"
          className="cs-reel-btn cs-reel-btn--secondary"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}
