"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import type { ReelItem } from "@/lib/site";
import { getLocalizedText } from "@/lib/site";
import { cn } from "@/lib/utils";

let activeAudioInstance: HTMLAudioElement | null = null;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export function ReelPlayer({
  reel,
  compact = false,
}: {
  reel: ReelItem;
  compact?: boolean;
}) {
  const { locale } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressId = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const syncDuration = () => setDuration(audio.duration || 0);
    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const onPause = () => {
      setIsPlaying(false);
      if (activeAudioInstance === audio) {
        activeAudioInstance = null;
      }
    };
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    if (activeAudioInstance && activeAudioInstance !== audio) {
      activeAudioInstance.pause();
      activeAudioInstance.currentTime = 0;
    }

    activeAudioInstance = audio;

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }

  function onProgressChange(value: string) {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const nextValue = Number(value);
    audio.currentTime = nextValue;
    setCurrentTime(nextValue);
  }

  return (
    <article
      className={cn(
        "panel rounded-[1.75rem] p-5 sm:p-6",
        isPlaying && "border-[rgba(240,213,168,0.26)] shadow-[0_0_0_1px_rgba(240,213,168,0.14),0_22px_48px_rgba(0,0,0,0.34)]",
      )}
    >
      <audio ref={audioRef} preload="metadata">
        <source src={reel.src} type={reel.mimeType} />
      </audio>

      <div className={cn("flex flex-col gap-5", compact ? "sm:flex-row sm:items-center sm:justify-between" : "")}>
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
            {getLocalizedText(reel.label, locale)}
          </div>
          <div>
            <h3 className="font-serif text-3xl leading-none tracking-[0.02em] text-foreground sm:text-[2.25rem]">
              {reel.title}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{reel.description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlayback}
          className="inline-flex h-15 w-15 items-center justify-center rounded-full border border-[rgba(240,213,168,0.34)] bg-[rgba(240,213,168,0.08)] text-accent-strong hover:-translate-y-0.5 hover:bg-[rgba(240,213,168,0.14)]"
          aria-label={isPlaying ? `Pause ${reel.title}` : `Play ${reel.title}`}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[0.72rem] font-medium uppercase tracking-[0.18em] text-muted">
          <label htmlFor={progressId}>{reel.note}</label>
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
        <input
          id={progressId}
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => onProgressChange(event.target.value)}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(255,255,255,0.08)] accent-[var(--accent)]"
          aria-label={`Seek ${reel.title}`}
        />
      </div>
    </article>
  );
}
