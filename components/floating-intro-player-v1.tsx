"use client";

import { useState } from "react";
import { Play, Pause, X } from "lucide-react";

export function FloatingIntroPlayerV1() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-full px-5 py-3 shadow-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 hover:bg-amber-500/30 flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-amber-400" />
            ) : (
              <Play className="w-5 h-5 text-amber-400 ml-0.5" />
            )}
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-300 truncate">
              Intro Reel
            </p>
            <div className="flex gap-1 mt-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-400/40 rounded-full"
                  style={{
                    height: `${4 + Math.random() * 8}px`,
                    opacity: isPlaying ? 0.8 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <audio
        src="/media/intro-demo-reel.mp3"
        controls={false}
        autoPlay={isPlaying}
      />
    </div>
  );
}
