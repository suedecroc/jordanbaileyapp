"use client";

import { useEffect, useState } from "react";
import type { Buyer, SpendEntry } from "@/lib/studio/types";
import { BUYERS_KEY } from "@/lib/studio/types";
import { logActivity, toast } from "@/lib/studio/activity";

type PlatformId = "feetfinder" | "feet_ig" | "personal_ig";

const SPEND_ORDER: Record<Buyer["spendLevel"], number> = {
  whale: 0,
  regular: 1,
  occasional: 2,
  lurker: 3,
};

function loadBuyers(): Buyer[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BUYERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveBuyers(buyers: Buyer[]) {
  localStorage.setItem(BUYERS_KEY, JSON.stringify(buyers));
}

function daysSince(ts: number): number {
  return Math.floor((Date.now() - ts) / 86_400_000);
}

function totalFromLog(log?: SpendEntry[]): number {
  return (log ?? []).reduce((sum, e) => sum + e.amount, 0);
}

function spendWithin(log: SpendEntry[] | undefined, days: number): number {
  if (!log) return 0;
  const cutoff = Date.now() - days * 86_400_000;
  return log.filter((e) => e.at >= cutoff).reduce((s, e) => s + e.amount, 0);
}

function fmt(n: number): string {
  return `$${n.toLocaleString()}`;
}

type Props = {
  onSendToGenerator: (idea: string, platform: PlatformId) => void;
};

export function BuyersView({ onSendToGenerator }: Props) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterFollowUp, setFilterFollowUp] = useState(false);
  const [adding, setAdding] = useState(false);
  const [spendInputs, setSpendInputs] = useState<Record<string, string>>({});
  const [newHandle, setNewHandle] = useState("");
  const [newSpend, setNewSpend] = useState<Buyer["spendLevel"]>("occasional");
  const [newNotes, setNewNotes] = useState("");
  const [newInterests, setNewInterests] = useState("");
  const [newTone, setNewTone] = useState<Buyer["tonePreference"]>("luxury");

  useEffect(() => {
    setBuyers(loadBuyers());
  }, []);

  function addBuyer() {
    if (!newHandle.trim()) return;
    const buyer: Buyer = {
      id: crypto.randomUUID(),
      handle: newHandle.trim().startsWith("@") ? newHandle.trim() : `@${newHandle.trim()}`,
      spendLevel: newSpend,
      interests: newInterests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tonePreference: newTone,
      customRequestHistory: [],
      lastContactAt: Date.now(),
      reliability: "unknown",
      conversionContent: [],
      notes: newNotes.trim(),
    };
    const next = [buyer, ...buyers];
    setBuyers(next);
    saveBuyers(next);
    setAdding(false);
    setNewHandle("");
    setNewNotes("");
    setNewInterests("");
    logActivity("buyer", `added buyer · ${buyer.handle}`, { tone: "good" });
  }

  function markContacted(id: string) {
    const b0 = buyers.find((b) => b.id === id);
    const next = buyers.map((b) =>
      b.id === id ? { ...b, lastContactAt: Date.now(), followUpDue: false } : b,
    );
    setBuyers(next);
    saveBuyers(next);
    if (b0) logActivity("followup", `contacted ${b0.handle}`, { tone: "good" });
  }

  function toggleFollowUp(id: string) {
    const b0 = buyers.find((b) => b.id === id);
    const next = buyers.map((b) =>
      b.id === id ? { ...b, followUpDue: !b.followUpDue } : b,
    );
    setBuyers(next);
    saveBuyers(next);
    if (b0) {
      toast(b0.followUpDue ? `cleared follow-up · ${b0.handle}` : `flagged follow-up · ${b0.handle}`);
    }
  }

  function deleteBuyer(id: string) {
    const b0 = buyers.find((b) => b.id === id);
    const next = buyers.filter((b) => b.id !== id);
    setBuyers(next);
    saveBuyers(next);
    if (expandedId === id) setExpandedId(null);
    if (b0) toast(`removed ${b0.handle}`, "danger");
  }

  function logSpend(id: string, amount: number) {
    if (!amount || isNaN(amount)) return;
    const b0 = buyers.find((b) => b.id === id);
    const entry: SpendEntry = { at: Date.now(), amount };
    const next = buyers.map((b) =>
      b.id === id
        ? {
            ...b,
            spendLog: [entry, ...(b.spendLog ?? [])],
            lastContactAt: Date.now(),
            followUpDue: false,
          }
        : b,
    );
    setBuyers(next);
    saveBuyers(next);
    setSpendInputs((s) => ({ ...s, [id]: "" }));
    if (b0) logActivity("spend", `+$${amount} · ${b0.handle}`, { tone: "good" });
  }

  const sorted = [...buyers].sort((a, b) => {
    // Follow-ups first, then by spend level, then by staleness
    if (a.followUpDue !== b.followUpDue) return a.followUpDue ? -1 : 1;
    if (SPEND_ORDER[a.spendLevel] !== SPEND_ORDER[b.spendLevel])
      return SPEND_ORDER[a.spendLevel] - SPEND_ORDER[b.spendLevel];
    return a.lastContactAt - b.lastContactAt;
  });

  const filtered = filterFollowUp ? sorted.filter((b) => b.followUpDue) : sorted;
  const followUpCount = buyers.filter((b) => b.followUpDue).length;

  const spendStats = {
    whale: buyers.filter((b) => b.spendLevel === "whale").length,
    regular: buyers.filter((b) => b.spendLevel === "regular").length,
    occasional: buyers.filter((b) => b.spendLevel === "occasional").length,
    lurker: buyers.filter((b) => b.spendLevel === "lurker").length,
  };

  const revenueWeek = buyers.reduce((sum, b) => sum + spendWithin(b.spendLog, 7), 0);
  const revenueMonth = buyers.reduce((sum, b) => sum + spendWithin(b.spendLog, 30), 0);
  const revenueAll = buyers.reduce((sum, b) => sum + totalFromLog(b.spendLog), 0);

  return (
    <section className="studio__view">
      <div className="studio__view-header">
        <h2 className="studio__view-title">Buyers</h2>
        <p className="studio__view-desc">
          Who&apos;s spending, who&apos;s dormant, who needs a follow-up. Know your room.
        </p>
      </div>

      {/* Revenue rollup */}
      {revenueAll > 0 && (
        <div className="studio__buyers-revenue">
          <div className="studio__buyers-rev-item">
            <span className="studio__buyers-rev-label">this week</span>
            <span className="studio__buyers-rev-value">{fmt(revenueWeek)}</span>
          </div>
          <div className="studio__buyers-rev-item">
            <span className="studio__buyers-rev-label">30 days</span>
            <span className="studio__buyers-rev-value">{fmt(revenueMonth)}</span>
          </div>
          <div className="studio__buyers-rev-item">
            <span className="studio__buyers-rev-label">all time</span>
            <span className="studio__buyers-rev-value">{fmt(revenueAll)}</span>
          </div>
        </div>
      )}

      {/* Stats strip */}
      {buyers.length > 0 && (
        <div className="studio__buyers-stats">
          {spendStats.whale > 0 && (
            <span className="studio__buyers-stat">
              <span className="studio__buyers-spend studio__buyers-spend--whale">whale</span>
              {spendStats.whale}
            </span>
          )}
          {spendStats.regular > 0 && (
            <span className="studio__buyers-stat">
              <span className="studio__buyers-spend studio__buyers-spend--regular">regular</span>
              {spendStats.regular}
            </span>
          )}
          {spendStats.occasional > 0 && (
            <span className="studio__buyers-stat">
              <span className="studio__buyers-spend studio__buyers-spend--occasional">
                occasional
              </span>
              {spendStats.occasional}
            </span>
          )}
          {followUpCount > 0 && (
            <span className="studio__buyers-stat studio__buyers-stat--alert">
              {followUpCount} follow-up{followUpCount > 1 ? "s" : ""} due
            </span>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="studio__buyers-toolbar">
        {followUpCount > 0 && (
          <button
            className={`studio__ghost ${filterFollowUp ? "is-on" : ""}`}
            onClick={() => setFilterFollowUp((v) => !v)}
          >
            {filterFollowUp ? "show all" : `follow-up · ${followUpCount}`}
          </button>
        )}
        <button className="studio__ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "cancel" : "+ add buyer"}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="studio__pipe-add">
          <input
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            placeholder="@handle"
            className="studio__pipe-input"
          />
          <div className="studio__pipe-add-row">
            <select
              value={newSpend}
              onChange={(e) => setNewSpend(e.target.value as Buyer["spendLevel"])}
              className="studio__pipe-select"
            >
              <option value="whale">Whale</option>
              <option value="regular">Regular</option>
              <option value="occasional">Occasional</option>
              <option value="lurker">Lurker</option>
            </select>
            <select
              value={newTone}
              onChange={(e) => setNewTone(e.target.value as Buyer["tonePreference"])}
              className="studio__pipe-select"
            >
              <option value="luxury">Luxury tone</option>
              <option value="dangerous">Dangerous tone</option>
              <option value="soft">Soft tone</option>
              <option value="playful">Playful tone</option>
              <option value="professional">Professional</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <input
            value={newInterests}
            onChange={(e) => setNewInterests(e.target.value)}
            placeholder="interests, comma-separated (heels, arch shots…)"
            className="studio__pipe-input"
          />
          <textarea
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="notes — what you know about this buyer"
            className="studio__pipe-input studio__pipe-idea"
            rows={2}
          />
          <button className="studio__go studio__go--sm" onClick={addBuyer}>
            add buyer
          </button>
        </div>
      )}

      {/* Buyer list */}
      {filtered.length === 0 ? (
        <div className="studio__empty">
          {buyers.length === 0
            ? "no buyers yet. don't be delulu — add somebody above."
            : "no follow-ups rn. touch grass or shoot something."}
        </div>
      ) : (
        <div className="studio__pipe-list">
          {filtered.map((buyer) => {
            const isExpanded = expandedId === buyer.id;
            const days = daysSince(buyer.lastContactAt);
            const isStale = days > 14;
            const loggedTotal = totalFromLog(buyer.spendLog);
            const displaySpend =
              loggedTotal > 0 ? fmt(loggedTotal) : buyer.totalSpend ?? null;
            const recentSpend = spendWithin(buyer.spendLog, 30);
            return (
              <div
                key={buyer.id}
                className={`studio__pipe-item ${buyer.followUpDue ? "studio__pipe-item--high" : ""} ${buyer.spendLevel === "whale" ? "is-starred" : ""}`}
              >
                <div
                  className="studio__pipe-item-head"
                  onClick={() => setExpandedId(isExpanded ? null : buyer.id)}
                >
                  <div className="studio__pipe-item-left">
                    <span
                      className={`studio__buyers-spend studio__buyers-spend--${buyer.spendLevel}`}
                    >
                      {buyer.spendLevel}
                    </span>
                    <span className="studio__pipe-item-idea">{buyer.handle}</span>
                    {buyer.followUpDue && (
                      <span className="studio__buyers-flag">follow up</span>
                    )}
                  </div>
                  <div className="studio__pipe-item-right">
                    {displaySpend && displaySpend !== "$0" && (
                      <span className="studio__buyers-total">{displaySpend}</span>
                    )}
                    <span className={`studio__buyers-days ${isStale ? "is-stale" : ""}`}>
                      {days}d
                    </span>
                    <span className="studio__pipe-chevron">{isExpanded ? "−" : "+"}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="studio__pipe-item-detail">
                    <div className="studio__pipe-meta-row">
                      {displaySpend && <span>total: {displaySpend}</span>}
                      {recentSpend > 0 && <span>30d: {fmt(recentSpend)}</span>}
                      <span>reliability: {buyer.reliability}</span>
                      <span>tone: {buyer.tonePreference}</span>
                      <span>last: {days === 0 ? "today" : `${days}d ago`}</span>
                    </div>

                    {/* Quick +$ log */}
                    <div className="studio__buyers-spend-log">
                      <div className="studio__pipe-caption-label">log payment</div>
                      <div className="studio__buyers-spend-input-row">
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="$ amount"
                          className="studio__pipe-input"
                          value={spendInputs[buyer.id] ?? ""}
                          onChange={(e) =>
                            setSpendInputs((s) => ({ ...s, [buyer.id]: e.target.value }))
                          }
                        />
                        <button
                          type="button"
                          className="studio__ghost"
                          onClick={() =>
                            logSpend(buyer.id, parseFloat(spendInputs[buyer.id] ?? "0"))
                          }
                        >
                          + log
                        </button>
                      </div>
                      {buyer.spendLog && buyer.spendLog.length > 0 && (
                        <div className="studio__buyers-spend-list">
                          {buyer.spendLog.slice(0, 5).map((e, i) => (
                            <div key={i} className="studio__buyers-spend-entry">
                              <span className="studio__buyers-spend-amt">{fmt(e.amount)}</span>
                              <span className="studio__buyers-spend-when">
                                {daysSince(e.at) === 0 ? "today" : `${daysSince(e.at)}d ago`}
                              </span>
                              {e.note && (
                                <span className="studio__buyers-spend-note">· {e.note}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {buyer.interests.length > 0 && (
                      <div className="studio__pipe-caption">
                        <div className="studio__pipe-caption-label">interests</div>
                        <div className="studio__pipe-caption-text">
                          {buyer.interests.join(" · ")}
                        </div>
                      </div>
                    )}

                    {buyer.customRequestHistory.length > 0 && (
                      <div className="studio__pipe-caption">
                        <div className="studio__pipe-caption-label">custom requests</div>
                        <div className="studio__pipe-caption-text">
                          {buyer.customRequestHistory.map((r, i) => (
                            <div key={i}>— {r}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {buyer.conversionContent.length > 0 && (
                      <div className="studio__pipe-caption">
                        <div className="studio__pipe-caption-label">converts on</div>
                        <div className="studio__pipe-caption-text">
                          {buyer.conversionContent.join(" · ")}
                        </div>
                      </div>
                    )}

                    {buyer.notes && (
                      <div className="studio__pipe-caption">
                        <div className="studio__pipe-caption-label">notes</div>
                        <div className="studio__pipe-caption-text">{buyer.notes}</div>
                      </div>
                    )}

                    {buyer.followUpNote && (
                      <div className="studio__pipe-caption studio__pipe-caption--highlight">
                        <div className="studio__pipe-caption-label">follow-up</div>
                        <div className="studio__pipe-caption-text">{buyer.followUpNote}</div>
                      </div>
                    )}

                    <div className="studio__pipe-actions">
                      <button className="studio__ghost" onClick={() => markContacted(buyer.id)}>
                        mark contacted
                      </button>
                      <button
                        className={`studio__ghost ${buyer.followUpDue ? "is-on" : ""}`}
                        onClick={() => toggleFollowUp(buyer.id)}
                      >
                        {buyer.followUpDue ? "clear follow-up" : "flag follow-up"}
                      </button>
                      <button
                        className="studio__ghost"
                        onClick={() => {
                          const prompt = `re-engage ${buyer.handle} — they like ${buyer.interests.slice(0, 3).join(", ")}. tone: ${buyer.tonePreference}. write something that pulls them back without being thirsty.`;
                          onSendToGenerator(prompt, "feetfinder");
                        }}
                      >
                        generate re-engage
                      </button>
                      <button
                        className="studio__ghost studio__ghost--danger"
                        onClick={() => deleteBuyer(buyer.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
