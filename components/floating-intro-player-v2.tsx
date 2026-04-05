"use client";

import { useState, useRef } from "react";
import { Play, Pause, X } from "lucide-react";

export function FloatingIntroPlayerV2() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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

  if (!isVisible) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/70 backdrop-blur-lg rounded-3xl p-10 max-w-md w-11/12 border border-amber-500/30">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-4">
            Hear The Voice First
          </p>
          <h2 className="text-3xl font-serif text-white mb-6">
            Intro Reel
          </h2>

          <button
            onClick={handlePlayPause}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 flex items-center justify-center transition-all shadow-lg hover:shadow-amber-500/50"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-white" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </button>

          <div className="space-y-3">
            <div className="bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
              <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handlePlayPause}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
            >
              Listen First
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 py-3 px-4 border border-slate-600 hover:border-white text-white font-semibold rounded-lg transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
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
