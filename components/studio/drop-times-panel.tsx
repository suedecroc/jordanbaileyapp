"use client";

import { useEffect, useState } from "react";

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
