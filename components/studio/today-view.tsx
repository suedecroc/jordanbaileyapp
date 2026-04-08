"use client";

import { useEffect, useRef, useState } from "react";
import type { Buyer, PipelineItem } from "@/lib/studio/types";
import { BUYERS_KEY, PIPELINE_KEY } from "@/lib/studio/types";

// Animate a number from current → target with eased ramp.
// Uses setInterval (works in any browser/env, including headless).
function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  useEffect(() => {
    const from = fromRef.current;
    if (target === from) {
      setValue(target);
      return;
    }
    const start = Date.now();
    const stepMs = 16;
    const id = window.setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (target - from) * eased);
      setValue(next);
      if (t >= 1) {
        fromRef.current = target;
        window.clearInterval(id);
      }
    }, stepMs);
    return () => window.clearInterval(id);
  }, [target, durationMs]);
  return value;
}

type Tab = "today" | "generator" | "pipeline" | "buyers";

// Best drop times by day — simplified from the full drop-times data.
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
type DayKey = (typeof DAYS)[number];

const DROP_TIMES: Record<DayKey, { time: string; platform: string; note: string }[]> = {
  Sun: [
    { time: "11:00 AM", platform: "FeetFinder IG", note: "Sunday scroll peak — lifestyle content lands" },
    { time: "8:00 PM", platform: "FeetFinder", note: "pre-week buyers closing tabs, impulse window" },
  ],
  Mon: [
    { time: "8:30 PM", platform: "FeetFinder IG", note: "commute-end scroll, strong engagement window" },
    { time: "11:00 PM", platform: "FeetFinder", note: "late-night conversion peak" },
  ],
  Tue: [
    { time: "7:45 PM", platform: "FeetFinder IG", note: "mid-week browse energy" },
    { time: "10:30 PM", platform: "FeetFinder", note: "impulse buyers active late" },
  ],
  Wed: [
    { time: "8:00 PM", platform: "FeetFinder IG", note: "mid-week wind-down, retention play" },
    { time: "11:30 PM", platform: "FeetFinder", note: "peak late-night window all week" },
  ],
  Thu: [
    { time: "7:30 PM", platform: "FeetFinder IG", note: "pre-weekend energy building" },
    { time: "10:00 PM", platform: "FeetFinder", note: "buyers warming up before the weekend" },
  ],
  Fri: [
    { time: "6:30 PM", platform: "FeetFinder IG", note: "Friday escape scroll — hook hard" },
    { time: "9:30 PM", platform: "FeetFinder", note: "weekend spending opens, premium content earns more" },
  ],
  Sat: [
    { time: "10:00 AM", platform: "Personal IG", note: "morning browse — personal voice hits different" },
    { time: "9:00 PM", platform: "FeetFinder", note: "peak weekend conversion window" },
  ],
};

type InsightPriority = "critical" | "high" | "medium" | "info";

type Insight = {
  label: string;
  body: string;
  action?: string;
  actionTab?: Tab;
  priority: InsightPriority;
};

const PLATFORM_NAMES: Record<string, string> = {
  feetfinder: "FeetFinder",
  feet_ig: "FeetFinder IG",
  personal_ig: "Personal IG",
};

function computeInsights(pipeline: PipelineItem[], buyers: Buyer[]): Insight[] {
  const insights: Insight[] = [];
  const DAY = 86_400_000;
  const now = Date.now();

  // 1. Ready to post (shot or edited)
  const readyItems = pipeline.filter((i) => i.stage === "shot" || i.stage === "edited");
  if (readyItems.length > 0) {
    const topItem = readyItems.find((i) => i.priority === "high") ?? readyItems[0];
    insights.push({
      label: `${readyItems.length} piece${readyItems.length > 1 ? "s" : ""} ready to post`,
      body: `"${topItem.idea.slice(0, 65)}${topItem.idea.length > 65 ? "…" : ""}" ${topItem.priority === "high" ? "— high priority" : "is waiting for the drop."}`,
      action: "view pipeline",
      actionTab: "pipeline",
      priority: "critical",
    });
  }

  // 2. Buyers needing follow-up
  const followUpBuyers = buyers.filter((b) => b.followUpDue);
  if (followUpBuyers.length > 0) {
    const whaleFollowUps = followUpBuyers.filter((b) => b.spendLevel === "whale");
    const lead = whaleFollowUps[0] ?? followUpBuyers[0];
    insights.push({
      label: `${followUpBuyers.length} buyer${followUpBuyers.length > 1 ? "s" : ""} need${followUpBuyers.length === 1 ? "s" : ""} a follow-up`,
      body: `${lead.handle}${followUpBuyers.length > 1 ? ` and ${followUpBuyers.length - 1} more` : ""}. Warm leads go cold fast — the re-engage content writes itself.`,
      action: "view buyers",
      actionTab: "buyers",
      priority: "high",
    });
  }

  // 3. Whales gone quiet (no follow-up flagged but stale)
  const staleWhales = buyers.filter(
    (b) =>
      b.spendLevel === "whale" &&
      now - b.lastContactAt > DAY * 10 &&
      !b.followUpDue,
  );
  if (staleWhales.length > 0) {
    const w = staleWhales[0];
    const d = Math.floor((now - w.lastContactAt) / DAY);
    insights.push({
      label: `${w.handle} hasn't heard from you in ${d} days`,
      body: `Whale accounts need periodic attention. A timely drop can re-activate significant spend without a direct ask.`,
      action: "view buyers",
      actionTab: "buyers",
      priority: "high",
    });
  }

  // 4. Platform neglect
  const recentPlatformCounts: Record<string, number> = {
    feetfinder: 0,
    feet_ig: 0,
    personal_ig: 0,
  };
  pipeline
    .filter((i) => now - i.createdAt < DAY * 14)
    .forEach((i) => {
      recentPlatformCounts[i.platform] = (recentPlatformCounts[i.platform] ?? 0) + 1;
    });

  const neglectedPlatform = Object.entries(recentPlatformCounts).sort(
    (a, b) => a[1] - b[1],
  )[0];
  if (neglectedPlatform && neglectedPlatform[1] === 0) {
    insights.push({
      label: `${PLATFORM_NAMES[neglectedPlatform[0]]} has nothing in the pipeline`,
      body: `Zero content planned for this account in the last two weeks. Every silent channel loses momentum — even one piece keeps it warm.`,
      action: "add to pipeline",
      actionTab: "pipeline",
      priority: "medium",
    });
  }

  // 5. Repurpose candidates — prefer actual winners
  const winners = pipeline.filter(
    (i) =>
      i.outcome === "winner" &&
      (i.stage === "posted" || i.stage === "repurpose") &&
      (i.postedAt ? now - i.postedAt > DAY * 14 : now - i.createdAt > DAY * 14),
  );
  const fallbackRepurpose = pipeline.filter(
    (i) =>
      !i.outcome &&
      (i.stage === "posted" || i.stage === "repurpose") &&
      i.repurposePotential === "high" &&
      (i.postedAt ? now - i.postedAt > DAY * 14 : now - i.createdAt > DAY * 14),
  );
  const repurposable = winners.length > 0 ? winners : fallbackRepurpose;
  if (repurposable.length > 0) {
    const top = repurposable[0];
    const isWinner = top.outcome === "winner";
    insights.push({
      label: `${repurposable.length} ${isWinner ? "winner" : "old piece"}${repurposable.length > 1 ? "s" : ""} worth repurposing`,
      body: `"${top.idea.slice(0, 55)}${top.idea.length > 55 ? "…" : ""}" ${isWinner ? "actually performed — repurposing a proven winner is the highest-ROI move you can make today." : "is marked high reuse potential. Good content shouldn't die after one use."}`,
      action: "view pipeline",
      actionTab: "pipeline",
      priority: isWinner ? "high" : "medium",
    });
  }

  // 6. Stale ideas (sitting in "idea" stage > 5 days)
  const staleIdeas = pipeline.filter(
    (i) => i.stage === "idea" && now - i.createdAt > DAY * 5,
  );
  if (staleIdeas.length > 0) {
    insights.push({
      label: `${staleIdeas.length} idea${staleIdeas.length > 1 ? "s" : ""} untouched for 5+ days`,
      body: `Ideas in the "idea" stage for over a week either need execution or deletion. Commit or cut — both are the right move.`,
      action: "view pipeline",
      actionTab: "pipeline",
      priority: "medium",
    });
  }

  // 7. Positive signal — posting rhythm
  const recentPosts = pipeline.filter(
    (i) => i.stage === "posted" && i.postedAt && now - i.postedAt < DAY * 7,
  );
  if (recentPosts.length >= 2) {
    insights.push({
      label: `${recentPosts.length} posts live this week — strong rhythm`,
      body: `Consistency compounds. Keep this pace and the algorithms stay warm. Now push quality over quantity.`,
      priority: "info",
    });
  }

  // 8. Default — all clear
  if (insights.length === 0) {
    insights.push({
      label: "Pipeline and buyers look clear",
      body: "Nothing urgent today. Good time to shoot ahead while you have the energy, or draft something strong before the idea cools.",
      action: "go to generator",
      actionTab: "generator",
      priority: "info",
    });
  }

  return insights;
}

type Props = {
  onNavigate: (tab: Tab) => void;
};

export function TodayView({ onNavigate }: Props) {
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    try {
      setPipeline(JSON.parse(localStorage.getItem(PIPELINE_KEY) ?? "[]"));
      setBuyers(JSON.parse(localStorage.getItem(BUYERS_KEY) ?? "[]"));
    } catch {}
  }, []);

  const insights = computeInsights(pipeline, buyers);
  const todayKey = DAYS[new Date().getDay()];
  const todaySlots = DROP_TIMES[todayKey] ?? [];

  // Revenue rollup — pulled from buyer spend logs
  const DAY_MS = 86_400_000;
  const revenueWeek = buyers
    .flatMap((b) => b.spendLog ?? [])
    .filter((e) => e.at >= Date.now() - DAY_MS * 7)
    .reduce((s, e) => s + e.amount, 0);
  const revenueMonth = buyers
    .flatMap((b) => b.spendLog ?? [])
    .filter((e) => e.at >= Date.now() - DAY_MS * 30)
    .reduce((s, e) => s + e.amount, 0);

  const readyToPost = pipeline
    .filter((i) => i.stage === "shot" || i.stage === "edited")
    .sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return p[a.priority] - p[b.priority];
    })
    .slice(0, 3);

  const followUpBuyers = buyers
    .filter((b) => b.followUpDue)
    .sort((a, b) => {
      const s = { whale: 0, regular: 1, occasional: 2, lurker: 3 };
      return s[a.spendLevel] - s[b.spendLevel];
    })
    .slice(0, 3);

  return (
    <section className="studio__view">
      <div className="studio__view-header">
        <h2 className="studio__view-title">Today</h2>
        <p className="studio__view-desc">
          What to do right now. Ranked by revenue impact.
        </p>
      </div>

      {/* Revenue rollup — count up on mount */}
      {revenueMonth > 0 && (
        <RevenueRollup week={revenueWeek} month={revenueMonth} />
      )}

      {/* Best drop times today */}
      <div className="studio__today-drops">
        <div className="studio__today-section-label">Best times to drop today · {todayKey}</div>
        <div className="studio__today-slots">
          {todaySlots.map((slot, i) => (
            <div key={i} className="studio__today-slot">
              <span className="studio__today-slot-time">{slot.time}</span>
              <span className="studio__today-slot-platform">{slot.platform}</span>
              <span className="studio__today-slot-note">{slot.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart insights */}
      <div className="studio__today-insights">
        <div className="studio__today-section-label">Prioritized action list</div>
        {insights.map((insight, i) => (
          <div key={i} className={`studio__today-card studio__today-card--${insight.priority}`}>
            <div className="studio__today-card-label">{insight.label}</div>
            <div className="studio__today-card-body">{insight.body}</div>
            {insight.action && insight.actionTab && (
              <button
                className="studio__ghost studio__ghost--sm"
                onClick={() => onNavigate(insight.actionTab!)}
              >
                {insight.action}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Ready to post */}
      {readyToPost.length > 0 && (
        <div className="studio__today-section">
          <div className="studio__today-section-label">Ready to post now</div>
          {readyToPost.map((item) => (
            <div key={item.id} className="studio__today-mini-card">
              <div className="studio__today-mini-top">
                <span className="studio__pipe-stage-tag">{item.stage}</span>
                <span className="studio__pipe-platform-tag">
                  {item.platform === "feetfinder"
                    ? "FF"
                    : item.platform === "feet_ig"
                      ? "IG"
                      : "Finsta"}
                </span>
                {item.priority === "high" && (
                  <span className="studio__pipe-priority">↑</span>
                )}
              </div>
              <div className="studio__today-mini-idea">{item.idea}</div>
              {item.performanceNote && (
                <div className="studio__today-mini-note">{item.performanceNote}</div>
              )}
            </div>
          ))}
          <button className="studio__ghost" onClick={() => onNavigate("pipeline")}>
            view full pipeline
          </button>
        </div>
      )}

      {/* Follow-up buyers */}
      {followUpBuyers.length > 0 && (
        <div className="studio__today-section">
          <div className="studio__today-section-label">Buyers to follow up</div>
          {followUpBuyers.map((buyer) => (
            <div key={buyer.id} className="studio__today-mini-card">
              <div className="studio__today-mini-top">
                <span
                  className={`studio__buyers-spend studio__buyers-spend--${buyer.spendLevel}`}
                >
                  {buyer.spendLevel}
                </span>
                <span className="studio__pipe-item-idea">{buyer.handle}</span>
                {buyer.totalSpend && buyer.totalSpend !== "$0" && (
                  <span className="studio__buyers-total">{buyer.totalSpend}</span>
                )}
              </div>
              {buyer.followUpNote && (
                <div className="studio__today-mini-idea">{buyer.followUpNote}</div>
              )}
            </div>
          ))}
          <button className="studio__ghost" onClick={() => onNavigate("buyers")}>
            view all buyers
          </button>
        </div>
      )}

      {/* Repurpose shelf */}
      {(() => {
        const repurposable = pipeline
          .filter(
            (i) =>
              (i.stage === "posted" || i.stage === "repurpose") &&
              i.repurposePotential === "high",
          )
          .slice(0, 2);
        if (!repurposable.length) return null;
        return (
          <div className="studio__today-section">
            <div className="studio__today-section-label">Worth repurposing</div>
            {repurposable.map((item) => (
              <div key={item.id} className="studio__today-mini-card">
                <div className="studio__today-mini-top">
                  <span className="studio__pipe-platform-tag">
                    {item.platform === "feetfinder"
                      ? "FF"
                      : item.platform === "feet_ig"
                        ? "IG"
                        : "Finsta"}
                  </span>
                </div>
                <div className="studio__today-mini-idea">{item.idea}</div>
                {item.performanceNote && (
                  <div className="studio__today-mini-note">{item.performanceNote}</div>
                )}
              </div>
            ))}
            <button className="studio__ghost" onClick={() => onNavigate("generator")}>
              generate repurpose
            </button>
          </div>
        );
      })()}
    </section>
  );
}

function RevenueRollup({ week, month }: { week: number; month: number }) {
  const animatedWeek = useCountUp(week);
  const animatedMonth = useCountUp(month, 1400);
  return (
    <div className="studio__today-revenue">
      <div className="studio__today-rev-card studio__today-rev-card--countup">
        <span className="studio__today-rev-label">this week</span>
        <span className="studio__today-rev-value">
          ${animatedWeek.toLocaleString()}
        </span>
      </div>
      <div className="studio__today-rev-card studio__today-rev-card--countup">
        <span className="studio__today-rev-label">last 30 days</span>
        <span className="studio__today-rev-value">
          ${animatedMonth.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
