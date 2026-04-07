"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ALL_DAYS,
  DROP_TIMES_FALLBACK,
  type DayKey,
  type DropTimesPayload,
  type PlatformDrops,
  type PlatformKey,
} from "@/lib/studio/drop-times";

type Response = { ok: boolean; data?: DropTimesPayload; error?: string };

const PLATFORM_ORDER: PlatformKey[] = ["instagram", "tiktok", "reddit", "feetfinder"];

const DAY_INDEX: Record<DayKey, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

type NextDrop = {
  platform: PlatformDrops;
  day: DayKey;
  time: string;
  hour24: number;
  note: string;
  fireAt: Date;
  msUntil: number;
};

// EST = America/New_York. Compute next chronological drop slot across all
// platforms based on the user's current wall-clock in EST.
function computeNextDrop(payload: DropTimesPayload, now: Date): NextDrop | null {
  // Get "now" as observed in America/New_York.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday")?.value as DayKey | undefined;
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  if (!wd) return null;
  const todayIdx = DAY_INDEX[wd];
  const nowMinutes = hour * 60 + minute;

  let best: NextDrop | null = null;
  for (const platform of payload.platforms) {
    for (const row of platform.week) {
      const dayIdx = DAY_INDEX[row.day];
      let dayDelta = (dayIdx - todayIdx + 7) % 7;
      for (const slot of row.slots) {
        const slotMinutes = slot.hour24 * 60;
        let delta = dayDelta;
        // If slot is today and already passed, push to next week.
        if (delta === 0 && slotMinutes <= nowMinutes) delta = 7;
        const msUntil = delta * 24 * 60 * 60 * 1000 + (slotMinutes - nowMinutes) * 60 * 1000;
        if (!best || msUntil < best.msUntil) {
          best = {
            platform,
            day: row.day,
            time: slot.time,
            hour24: slot.hour24,
            note: slot.note,
            fireAt: new Date(now.getTime() + msUntil),
            msUntil,
          };
        }
      }
    }
  }
  return best;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "now";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days >= 1) return `${days}d ${hours}h`;
  if (hours >= 1) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatUpdated(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function dayLabel(d: DayKey): string {
  const map: Record<DayKey, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  return map[d];
}

function platformByKey(payload: DropTimesPayload, key: PlatformKey): PlatformDrops | undefined {
  return payload.platforms.find((p) => p.key === key);
}

function ConfidenceDot({ level }: { level: "high" | "medium" | "low" }) {
  return <span className={`studio__drop-dot studio__drop-dot--${level}`} aria-label={level} />;
}

export function DropTimesPanel() {
  const [payload, setPayload] = useState<DropTimesPayload>(DROP_TIMES_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<PlatformKey>("instagram");
  const [activeDay, setActiveDay] = useState<DayKey>(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" }) as DayKey;
    return (ALL_DAYS as DayKey[]).includes(today) ? today : "Mon";
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/studio/drop-times", { cache: "no-store" });
        const json: Response = await res.json();
        if (!cancelled && json.ok && json.data) {
          setPayload(json.data);
        }
      } catch {
        // keep fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const active = platformByKey(payload, activePlatform);
  const activeRow = active?.week.find((w) => w.day === activeDay);

  // Tick every minute so the next-drop countdown stays fresh.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);
  const nextDrop = useMemo(
    () => computeNextDrop(payload, new Date()),
    // tick triggers recompute, payload triggers on data refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload, tick],
  );

  const [notifyState, setNotifyState] = useState<"idle" | "armed" | "denied" | "unsupported">(
    "idle",
  );

  async function armNotification() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotifyState("unsupported");
      return;
    }
    if (!nextDrop) return;
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    if (perm !== "granted") {
      setNotifyState("denied");
      return;
    }
    setNotifyState("armed");
    // While the tab/PWA stays open, fire a local notification at the window.
    // (Real background push needs a service worker — out of scope for v1.)
    const ms = Math.max(0, nextDrop.msUntil);
    window.setTimeout(() => {
      try {
        new Notification("Gigasuede — drop window", {
          body: `${nextDrop.platform.label} · ${nextDrop.time} · ${nextDrop.note}`,
          tag: "gigasuede-drop",
        });
      } catch {}
      setNotifyState("idle");
    }, ms);
  }

  return (
    <section className="studio__act studio__act--center studio__act--field" aria-label="Drop Times Field Report">
      <div className="studio__act-numeral" aria-hidden="true">00</div>
      <div className="studio__act-body">
        <div className="studio__act-label studio__act-label--center">
          <span className="studio__act-tag">Field Report</span>
          <h2 className="studio__act-title">Drop Times</h2>
          <p className="studio__act-desc">
            {payload.tagline}{" "}
            <span className="studio__drop-stamp">
              {payload.source === "claude-web" ? "live" : "curated"} · refreshed{" "}
              {formatUpdated(payload.updatedAt)}
            </span>
          </p>
        </div>

        {/* Next-Up card — closest upcoming window across all platforms */}
        {nextDrop ? (
          <div className="studio__next-drop">
            <span className="studio__next-drop-eyebrow">Next Up · {formatCountdown(nextDrop.msUntil)} from now</span>
            <h3 className="studio__next-drop-title">
              {nextDrop.platform.label} · {dayLabel(nextDrop.day)} {nextDrop.time}
            </h3>
            <div className="studio__next-drop-meta">{nextDrop.note}</div>
            <div className="studio__next-drop-actions">
              <button
                type="button"
                className="studio__ghost"
                onClick={() => {
                  setActivePlatform(nextDrop.platform.key);
                  setActiveDay(nextDrop.day);
                }}
              >
                jump to slot
              </button>
              <button
                type="button"
                className={`studio__ghost ${notifyState === "armed" ? "is-on" : ""}`}
                onClick={armNotification}
                disabled={notifyState === "armed" || notifyState === "unsupported"}
                title={
                  notifyState === "unsupported"
                    ? "Notifications not supported here"
                    : notifyState === "denied"
                    ? "Notifications blocked — enable in Settings"
                    : "Buzz me when the window opens (keep the app open)"
                }
              >
                {notifyState === "armed"
                  ? "✓ armed"
                  : notifyState === "denied"
                  ? "blocked"
                  : notifyState === "unsupported"
                  ? "n/a"
                  : "buzz me"}
              </button>
            </div>
          </div>
        ) : null}

        {/* Platform tabs */}
        <div className="studio__drop-tabs" role="tablist" aria-label="platform">
          {PLATFORM_ORDER.map((key) => {
            const p = platformByKey(payload, key);
            if (!p) return null;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activePlatform === key}
                className={`studio__drop-tab ${activePlatform === key ? "is-on" : ""}`}
                onClick={() => setActivePlatform(key)}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Editorial blurb for active platform */}
        {active ? (
          <p className="studio__drop-blurb">
            <span className="studio__drop-blurb-mark">¶</span> {active.blurb}
          </p>
        ) : null}

        {/* The broadsheet table */}
        <div className="studio__drop-table" role="table" aria-busy={loading}>
          <div className="studio__drop-thead" role="row">
            <div className="studio__drop-th studio__drop-th--day" role="columnheader">Day</div>
            <div className="studio__drop-th" role="columnheader">Drop Window — EST</div>
            <div className="studio__drop-th studio__drop-th--note" role="columnheader">House Note</div>
          </div>
          {active?.week.map((row) => {
            const isToday = row.day === activeDay;
            return (
              <button
                key={row.day}
                type="button"
                role="row"
                onClick={() => setActiveDay(row.day)}
                className={`studio__drop-row ${isToday ? "is-on" : ""}`}
                aria-current={isToday ? "true" : undefined}
              >
                <div className="studio__drop-td studio__drop-td--day" role="cell">
                  <span className="studio__drop-day-short">{row.day}</span>
                  <span className="studio__drop-day-long">{dayLabel(row.day)}</span>
                </div>
                <div className="studio__drop-td studio__drop-td--slots" role="cell">
                  {row.slots.map((s, i) => (
                    <span key={i} className="studio__drop-slot">
                      <ConfidenceDot level={s.confidence} />
                      <span className="studio__drop-time">{s.time}</span>
                    </span>
                  ))}
                </div>
                <div className="studio__drop-td studio__drop-td--note" role="cell">
                  {row.slots[0]?.note ?? ""}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail callout for the actively-focused day */}
        {activeRow ? (
          <div className="studio__drop-callout">
            <div className="studio__drop-callout-day">
              <span className="studio__drop-callout-eyebrow">{active?.label} · {dayLabel(activeRow.day)}</span>
              <h3 className="studio__drop-callout-title">
                {activeRow.slots.map((s) => s.time).join("  ·  ")}
              </h3>
            </div>
            <ul className="studio__drop-callout-list">
              {activeRow.slots.map((s, i) => (
                <li key={i}>
                  <ConfidenceDot level={s.confidence} />
                  <strong>{s.time}</strong> — <span>{s.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Legend */}
        <div className="studio__drop-legend" aria-hidden="true">
          <span><ConfidenceDot level="high" /> high confidence</span>
          <span><ConfidenceDot level="medium" /> medium</span>
          <span><ConfidenceDot level="low" /> experimental</span>
        </div>
      </div>
    </section>
  );
}
