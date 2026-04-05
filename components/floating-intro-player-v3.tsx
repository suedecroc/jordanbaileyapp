"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

export function FloatingIntroPlayerV3() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="sticky top-20 z-40 ml-auto mb-6 w-72">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200/50 p-6 shadow-lg">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Experience First
            </p>
            <h3 className="text-xl font-serif text-slate-900">
              Intro Reel
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/30"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white" />
              ) : (
                <Play className="w-7 h-7 text-white ml-0.5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="bg-slate-300 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-600">
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex gap-3">
            <button
              onClick={handlePlayPause}
              className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Listen First
            </button>
            <a
              href="mailto:jrdnbailey23@gmail.com"
              className="flex-1 py-2 px-3 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-semibold rounded-lg transition-colors text-center"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src="/media/intro-demo-reel.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
