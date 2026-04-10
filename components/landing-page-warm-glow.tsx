"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function LandingPageWarmGlow() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --wg-bg: #060608;
          --wg-ink: #f0ede8;
          --wg-gold: #c9a84c;
          --wg-gold-bright: #e0c060;
          --wg-gold-glow: rgba(201, 168, 76, 0.4);
          --wg-crimson: #b82545;
          --wg-crimson-glow: rgba(192, 44, 79, 0.35);
        }

        .wg-page {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: var(--wg-bg);
          color: var(--wg-ink);
          font-family: system-ui, sans-serif;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .wg-grain-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: #070709;
        }

        .wg-grain-bg::before {
          content: "";
          position: absolute;
          inset: -15%;
          opacity: 0.14;
          mix-blend-mode: screen;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: wg-grain 0.35s steps(6) infinite;
        }

        .wg-grain-bg::after {
          content: "";
          position: absolute;
          inset: -10%;
          opacity: 0.07;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23f)'/%3E%3C/svg%3E");
          animation: wg-grain2 0.25s steps(5) infinite;
        }

        @keyframes wg-grain {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-2%, 1.5%); }
          40% { transform: translate(1.5%, -2%); }
          60% { transform: translate(-1%, 2.5%); }
          80% { transform: translate(2%, -1%); }
          100% { transform: translate(0, 0); }
        }

        @keyframes wg-grain2 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(1%, -1.5%); }
          66% { transform: translate(-1.5%, 2%); }
          100% { transform: translate(0, 0); }
        }

        .wg-grain-top {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          opacity: 0.04;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='t'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23t)'/%3E%3C/svg%3E");
          animation: wg-grain 0.5s steps(4) infinite;
        }

        .wg-hero {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .wg-card {
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 85vh;
          max-width: min(90vw, 600px);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04),
                      0 30px 80px rgba(0, 0, 0, 0.55),
                      0 10px 30px rgba(0, 0, 0, 0.35);
          animation: wg-cardIn 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes wg-cardIn {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .wg-card::before {
          content: "";
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at 50% 55%,
            rgba(201, 168, 76, 0.1) 0%,
            rgba(192, 44, 79, 0.06) 40%,
            transparent 70%
          );
          filter: blur(50px);
          z-index: -1;
          animation: wg-glow 7s ease-in-out infinite;
        }

        @keyframes wg-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }

        .wg-photo {
          display: block;
          width: 100%;
          height: auto;
        }

        .wg-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem 1rem 1.2rem;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.72) 0%,
            rgba(0, 0, 0, 0.35) 55%,
            transparent 100%
          );
          animation: wg-btnIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }

        @keyframes wg-btnIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wg-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.7rem 1.15rem;
          border-radius: 999px;
          font-family: system-ui, sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: none;
        }

        .wg-btn--listen {
          background: rgba(201, 168, 76, 0.14);
          color: var(--wg-gold-bright);
          border: 1px solid rgba(201, 168, 76, 0.24);
        }
        .wg-btn--listen:hover {
          background: rgba(201, 168, 76, 0.24);
          border-color: rgba(201, 168, 76, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 6px 28px var(--wg-gold-glow);
        }

        .wg-btn--work {
          background: rgba(255, 255, 255, 0.07);
          color: var(--wg-ink);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .wg-btn--work:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.05);
        }

        .wg-btn--book {
          background: rgba(192, 44, 79, 0.14);
          color: #f2a8bb;
          border: 1px solid rgba(192, 44, 79, 0.24);
        }
        .wg-btn--book:hover {
          background: rgba(192, 44, 79, 0.24);
          border-color: rgba(192, 44, 79, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 6px 28px var(--wg-crimson-glow);
        }

        .wg-btn__icon {
          width: 11px;
          height: 11px;
          fill: currentColor;
        }

        @media (max-width: 600px) {
          .wg-hero { padding: 0.75rem; }
          .wg-card {
            max-width: 100%;
            max-height: 92vh;
            border-radius: 12px;
          }
          .wg-actions {
            flex-direction: column;
            gap: 0.4rem;
            padding: 1rem 0.6rem max(0.6rem, env(safe-area-inset-bottom));
          }
          .wg-btn {
            width: 100%;
            justify-content: center;
            padding: 0.8rem 1rem;
            font-size: 0.65rem;
          }
        }

        @media (min-width: 601px) and (max-width: 1024px) {
          .wg-card {
            max-width: min(75vw, 520px);
            max-height: 85vh;
          }
        }

        @media (min-width: 1400px) {
          .wg-card {
            max-width: 580px;
            max-height: 82vh;
          }
          .wg-btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.66rem;
          }
        }
      `}</style>

      <div className="wg-page">
        <div className="wg-grain-bg" />
        <div className="wg-grain-top" />

        <audio ref={audioRef} src="/media/reels/intro-demo-reel.mp3" preload="metadata" />

        <section className="wg-hero">
          <div className="wg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/images/hero.webp"
              alt="Jordan Bailey — Voice Actor"
              className="wg-photo"
            />
            <div className="wg-actions">
              <button
                type="button"
                className="wg-btn wg-btn--listen"
                onClick={toggleAudio}
              >
                <svg className="wg-btn__icon" viewBox="0 0 24 24">
                  {playing ? (
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
                {playing ? "Pause" : "Listen First"}
              </button>

              <Link href="/home" className="wg-btn wg-btn--work">
                Let&#39;s Work
              </Link>

              <Link href="/book" className="wg-btn wg-btn--book">
                Book Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
