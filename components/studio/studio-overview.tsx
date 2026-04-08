"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { PipelineItem } from "@/lib/studio/types";
import { PIPELINE_KEY, SEEDED_KEY, SEEDED_PIPELINE, BUYERS_KEY, SEEDED_BUYERS } from "@/lib/studio/types";

type PlatformId = "feetfinder" | "feet_ig" | "personal_ig";

const ACCOUNTS: { id: PlatformId; href: string; label: string; sub: string }[] = [
  {
    id: "feetfinder",
    href: "/studio/ff",
    label: "FeetFinder",
    sub: "the platform — captions, customs, buyers",
  },
  {
    id: "feet_ig",
    href: "/studio/ffig",
    label: "FeetFinder · IG",
    sub: "the funnel — drops, teases, calendar",
  },
  {
    id: "personal_ig",
    href: "/studio/me",
    label: "Personal IG",
    sub: "the voice — finsta energy, personal brand",
  },
];

export function StudioOverview() {
  const [items, setItems] = useState<PipelineItem[]>([]);

  // Seed pipeline + buyers on first visit so the overview isn't empty.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(SEEDED_KEY)) {
      if (!localStorage.getItem(PIPELINE_KEY))
        localStorage.setItem(PIPELINE_KEY, JSON.stringify(SEEDED_PIPELINE));
      if (!localStorage.getItem(BUYERS_KEY))
        localStorage.setItem(BUYERS_KEY, JSON.stringify(SEEDED_BUYERS));
      localStorage.setItem(SEEDED_KEY, "1");
    }
    try {
      setItems(JSON.parse(localStorage.getItem(PIPELINE_KEY) ?? "[]"));
    } catch {}
  }, []);

  function countFor(id: PlatformId) {
    return items.filter((i) => i.platform === id).length;
  }

  function pendingFor(id: PlatformId) {
    return items.filter(
      (i) =>
        i.platform === id &&
        i.stage !== "posted" &&
        i.stage !== "repurpose",
    ).length;
  }

  function liveFor(id: PlatformId) {
    return items.filter((i) => i.platform === id && i.stage === "posted").length;
  }

  const totalPending = items.filter((i) => i.stage !== "posted" && i.stage !== "repurpose").length;

  return (
    <main className="studio-overview">
      <header className="studio-overview__hero">
        <div className="studio-overview__eyebrow">VOICE 01 · ATLANTA, GA · A PRIVATE BROADCAST</div>
        <h1 className="studio-overview__mark">Gigasuede</h1>
        <p className="studio-overview__blurb">
          Three voices. One desk. Pick a room — every account has its own pipeline,
          its own pace, its own captions.
        </p>
        <div className="studio-overview__pulse">
          <span className="studio-overview__pulse-num">{totalPending}</span>
          <span className="studio-overview__pulse-label">in flight across all accounts</span>
        </div>
      </header>

      <section className="studio-overview__grid" aria-label="accounts">
        {ACCOUNTS.map((a) => {
          const total = countFor(a.id);
          const pending = pendingFor(a.id);
          const live = liveFor(a.id);
          return (
            <Link key={a.id} href={a.href} className="studio-overview__card">
              <div className="studio-overview__card-top">
                <div className="studio-overview__card-label">{a.label}</div>
                <div className="studio-overview__card-arrow">→</div>
              </div>
              <p className="studio-overview__card-sub">{a.sub}</p>
              <div className="studio-overview__card-stats">
                <div>
                  <span className="studio-overview__stat-num">{pending}</span>
                  <span className="studio-overview__stat-label">in flight</span>
                </div>
                <div>
                  <span className="studio-overview__stat-num">{live}</span>
                  <span className="studio-overview__stat-label">live</span>
                </div>
                <div>
                  <span className="studio-overview__stat-num">{total}</span>
                  <span className="studio-overview__stat-label">total</span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
