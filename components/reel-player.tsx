"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { getLocalizedText, type ReelItem } from "@/lib/site";
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

  const label = getLocalizedText(reel.label, locale);
  const title = getLocalizedText(reel.title, locale);
  const description = getLocalizedText(reel.description, locale);
  const note = getLocalizedText(reel.note, locale);

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
        compact
          ? "panel rounded-[1.75rem] p-5 sm:p-6"
          : "reel-player-stage rounded-[1.75rem] p-5 sm:p-6",
        isPlaying &&
          (compact
            ? "border-[rgba(111,67,35,0.26)] shadow-[0_0_0_1px_rgba(111,67,35,0.08),0_18px_34px_rgba(54,36,20,0.12)]"
            : "border-[rgba(223,194,155,0.22)] shadow-[0_0_0_1px_rgba(223,194,155,0.06),0_22px_36px_rgba(8,6,5,0.26)]"),
      )}
    >
      <audio ref={audioRef} preload="none">
        <source src={reel.src} type={reel.mimeType} />
      </audio>

      <div
          className={cn(
            "flex flex-col gap-5",
            compact && "sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className={cn("space-y-3", compact && "sm:max-w-[24rem]")}>
          <div
            className={cn(
              "inline-flex rounded-[0.7rem] border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]",
              compact
                ? "border-[var(--line)] bg-[rgba(255,255,255,0.5)] text-accent-strong"
                : "border-[rgba(223,194,155,0.16)] bg-[rgba(255,255,255,0.06)] text-[#ecd4b0]",
            )}
          >
            {label}
          </div>
          <div>
            <h3
              className={cn(
                "font-serif text-3xl leading-none tracking-[0.02em] sm:text-[2.25rem]",
                compact ? "text-foreground" : "text-[var(--ink-surface-text)]",
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                "mt-3 max-w-2xl text-base leading-7",
                compact ? "text-muted" : "text-[rgba(247,241,231,0.74)]",
              )}
            >
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlayback}
          className={cn(
            "audio-trigger inline-flex items-center justify-center",
            isPlaying && "audio-trigger--active",
          )}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </button>
      </div>

      <div className="mt-5">
        <div
          className={cn(
            "mb-2 flex items-center justify-between gap-4 text-[0.72rem] font-medium uppercase tracking-[0.18em]",
            compact ? "text-muted" : "text-[rgba(247,241,231,0.62)]",
          )}
        >
          <label htmlFor={progressId}>{note}</label>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <input
          id={progressId}
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => onProgressChange(event.target.value)}
          className={cn(
            "audio-track h-2 w-full cursor-pointer appearance-none rounded-full",
            compact ? "bg-[rgba(23,19,16,0.09)]" : "bg-[rgba(255,255,255,0.12)]",
          )}
          aria-label={`Seek ${title}`}
        />
      </div>
    </article>
  );
}
