"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentStage, Outcome, PipelineItem, Priority } from "@/lib/studio/types";
import { PIPELINE_KEY } from "@/lib/studio/types";
import { logActivity, toast } from "@/lib/studio/activity";

type PlatformId = "feetfinder" | "feet_ig" | "personal_ig";

const STAGE_ORDER: ContentStage[] = [
  "idea",
  "drafted",
  "shot",
  "edited",
  "scheduled",
  "posted",
  "repurpose",
];

const STAGE_LABELS: Record<ContentStage, string> = {
  idea: "Idea",
  drafted: "Drafted",
  shot: "Shot",
  edited: "Edited",
  scheduled: "Scheduled",
  posted: "Live",
  repurpose: "Repurpose",
};

const PLATFORM_LABELS: Record<PlatformId, string> = {
  feetfinder: "FF",
  feet_ig: "IG",
  personal_ig: "Finsta",
};

function nextStage(stage: ContentStage): ContentStage | null {
  const idx = STAGE_ORDER.indexOf(stage);
  // "posted" → "repurpose" is allowed; "repurpose" has no next
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}

function loadPipeline(): PipelineItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PIPELINE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function savePipeline(items: PipelineItem[]) {
  localStorage.setItem(PIPELINE_KEY, JSON.stringify(items));
}

function daysAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 86_400_000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

// Compress an image file to a data URL under ~300KB.
async function compressImage(file: File, maxWidth = 720, quality = 0.72): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = dataUrl;
  });
  const scale = Math.min(1, maxWidth / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

type Props = {
  onSendToGenerator: (idea: string, platform: PlatformId) => void;
  lockPlatform?: PlatformId;
};

export function PipelineView({ onSendToGenerator, lockPlatform }: Props) {
  const [allItems, setAllItems] = useState<PipelineItem[]>([]);
  const [filterStage, setFilterStage] = useState<ContentStage | "all">("all");
  const [winnersOnly, setWinnersOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState("");
  const [newPlatform, setNewPlatform] = useState<PlatformId>(lockPlatform ?? "feetfinder");
  // When lockPlatform is set, the view shows only that account's items.
  // Mutations still operate on the full pipeline (allItems) so we don't lose other accounts.
  const items = lockPlatform
    ? allItems.filter((i) => i.platform === lockPlatform)
    : allItems;
  const [newStage, setNewStage] = useState<ContentStage>("idea");
  const [newTheme, setNewTheme] = useState("");
  const [newVibe, setNewVibe] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [newMediaNote, setNewMediaNote] = useState("");

  useEffect(() => {
    setAllItems(loadPipeline());
  }, []);

  const sorted = [...items].sort((a, b) => {
    const p: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
    return b.createdAt - a.createdAt;
  });

  const stageFiltered =
    filterStage === "all" ? sorted : sorted.filter((i) => i.stage === filterStage);
  const filteredItems = winnersOnly
    ? stageFiltered.filter((i) => i.outcome === "winner")
    : stageFiltered;

  // Group scheduled items by date for the calendar section
  const scheduledByDate: Record<string, PipelineItem[]> = {};
  items
    .filter((i) => i.stage === "scheduled" && i.scheduledFor)
    .forEach((i) => {
      const d = i.scheduledFor!;
      (scheduledByDate[d] ||= []).push(i);
    });
  const scheduledDates = Object.keys(scheduledByDate).sort();

  function addItem() {
    if (!newIdea.trim()) return;
    const item: PipelineItem = {
      id: crypto.randomUUID(),
      stage: newStage,
      idea: newIdea.trim(),
      platform: newPlatform,
      theme: newTheme.trim() || "general",
      vibe: newVibe.trim() || "luxury",
      mediaNote: newMediaNote.trim() || undefined,
      priority: newPriority,
      createdAt: Date.now(),
      repurposePotential: "medium",
    };
    const next = [item, ...allItems];
    setAllItems(next);
    savePipeline(next);
    setAdding(false);
    setNewIdea("");
    setNewTheme("");
    setNewVibe("");
    setNewMediaNote("");
    logActivity("pipeline", `added to pipeline · "${item.idea.slice(0, 48)}"`, { tone: "good" });
  }

  function moveStage(id: string, stage: ContentStage) {
    const item = allItems.find((i) => i.id === id);
    const next = allItems.map((i) =>
      i.id === id
        ? { ...i, stage, ...(stage === "posted" ? { postedAt: Date.now() } : {}) }
        : i,
    );
    setAllItems(next);
    savePipeline(next);
    if (item) {
      logActivity(
        stage === "posted" ? "ship" : "stage",
        stage === "posted"
          ? `shipped · "${item.idea.slice(0, 48)}"`
          : `moved to ${STAGE_LABELS[stage]} · "${item.idea.slice(0, 40)}"`,
        { tone: stage === "posted" ? "good" : "default" },
      );
    }
  }

  function toggleStar(id: string) {
    const item = allItems.find((i) => i.id === id);
    const next = allItems.map((i) => (i.id === id ? { ...i, starred: !i.starred } : i));
    setAllItems(next);
    savePipeline(next);
    if (item) toast(item.starred ? "unstarred" : "starred ★");
  }

  function setOutcome(id: string, outcome: Outcome) {
    const item = allItems.find((i) => i.id === id);
    const next = allItems.map((i) =>
      i.id === id ? { ...i, outcome: i.outcome === outcome ? null : outcome } : i,
    );
    setAllItems(next);
    savePipeline(next);
    if (item && outcome) {
      logActivity(
        "outcome",
        `${outcome === "winner" ? "★ winner" : "✗ flop"} · "${item.idea.slice(0, 40)}"`,
        { tone: outcome === "winner" ? "good" : "warn" },
      );
    }
  }

  function triggerUpload(id: string) {
    setUploadTargetId(id);
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const id = uploadTargetId;
    // Reset the input so the same file can be re-picked later.
    e.target.value = "";
    setUploadTargetId(null);
    if (!file || !id) return;
    try {
      const url = await compressImage(file);
      const next = allItems.map((i) => (i.id === id ? { ...i, mediaDataUrl: url } : i));
      setAllItems(next);
      savePipeline(next);
    } catch {
      // swallow
    }
  }

  function removeMedia(id: string) {
    const next = allItems.map((i) => (i.id === id ? { ...i, mediaDataUrl: undefined } : i));
    setAllItems(next);
    savePipeline(next);
  }

  function deleteItem(id: string) {
    const item = allItems.find((i) => i.id === id);
    const next = allItems.filter((i) => i.id !== id);
    setAllItems(next);
    savePipeline(next);
    if (expandedId === id) setExpandedId(null);
    if (item) toast(`deleted · "${item.idea.slice(0, 36)}"`, "danger");
  }

  const stageCounts = STAGE_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: items.filter((i) => i.stage === s).length }),
    {} as Record<ContentStage, number>,
  );

  return (
    <section className="studio__view">
      <div className="studio__view-header">
        <h2 className="studio__view-title">Pipeline</h2>
        <p className="studio__view-desc">
          Every piece of content, every stage. Move it forward — or know exactly why it&apos;s
          waiting.
        </p>
      </div>

      {/* Stage filter */}
      <div className="studio__pipe-stages">
        <button
          className={`studio__pipe-stage-btn ${filterStage === "all" ? "is-on" : ""}`}
          onClick={() => setFilterStage("all")}
        >
          All <span className="studio__pipe-count">{items.length}</span>
        </button>
        {STAGE_ORDER.map((s) => (
          <button
            key={s}
            className={`studio__pipe-stage-btn ${filterStage === s ? "is-on" : ""}`}
            onClick={() => setFilterStage(s)}
          >
            {STAGE_LABELS[s]}
            {stageCounts[s] > 0 && (
              <span className="studio__pipe-count">{stageCounts[s]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="studio__pipe-toolbar">
        <button className="studio__ghost" onClick={() => setAdding((v) => !v)}>
          {adding ? "cancel" : "+ add item"}
        </button>
        <button
          className={`studio__ghost ${winnersOnly ? "is-on" : ""}`}
          onClick={() => setWinnersOnly((v) => !v)}
        >
          {winnersOnly ? "★ winners only" : "☆ winners only"}
        </button>
      </div>

      {/* Hidden file input for media upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      {/* Scheduled calendar — compact, only when there's something scheduled */}
      {scheduledDates.length > 0 && filterStage === "all" && !winnersOnly && (
        <div className="studio__pipe-calendar">
          <div className="studio__today-section-label">Calendar · what's queued</div>
          {scheduledDates.map((d) => {
            const date = new Date(d + "T00:00:00");
            const label = date.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const isPast = date.getTime() < Date.now() - 86_400_000;
            return (
              <div key={d} className="studio__pipe-cal-day">
                <div
                  className={`studio__pipe-cal-date ${isPast ? "is-past" : ""}`}
                >
                  {label}
                </div>
                {scheduledByDate[d].map((item) => (
                  <div
                    key={item.id}
                    className="studio__pipe-cal-item"
                    onClick={() => {
                      setFilterStage("all");
                      setExpandedId(item.id);
                    }}
                  >
                    <span className="studio__pipe-platform-tag">
                      {PLATFORM_LABELS[item.platform]}
                    </span>
                    <span className="studio__pipe-cal-idea">{item.idea}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Add form */}
      {adding && (
        <div className="studio__pipe-add">
          <textarea
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="raw idea — what's the content?"
            className="studio__pipe-input studio__pipe-idea"
            rows={2}
          />
          <div className="studio__pipe-add-row">
            {lockPlatform ? null : (
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as PlatformId)}
                className="studio__pipe-select"
              >
                <option value="feetfinder">FeetFinder</option>
                <option value="feet_ig">FeetFinder IG</option>
                <option value="personal_ig">Personal IG</option>
              </select>
            )}
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value as ContentStage)}
              className="studio__pipe-select"
            >
              {STAGE_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s]}
                </option>
              ))}
            </select>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Priority)}
              className="studio__pipe-select"
            >
              <option value="high">High priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="studio__pipe-add-row">
            <input
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              placeholder="theme (luxury, soft aesthetic…)"
              className="studio__pipe-input"
            />
            <input
              value={newVibe}
              onChange={(e) => setNewVibe(e.target.value)}
              placeholder="vibe (dangerous, playful…)"
              className="studio__pipe-input"
            />
          </div>
          <textarea
            value={newMediaNote}
            onChange={(e) => setNewMediaNote(e.target.value)}
            placeholder="shot notes — optional"
            className="studio__pipe-input studio__pipe-idea"
            rows={2}
          />
          <button className="studio__go studio__go--sm" onClick={addItem}>
            add to pipeline
          </button>
        </div>
      )}

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="studio__empty">
          {items.length === 0
            ? "pipeline is drier than atlanta in july. add something above."
            : winnersOnly
              ? "no winners yet. let him cook."
              : "nothing in this stage. period pooh."}
        </div>
      ) : (
        <div className="studio__pipe-list">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const next = nextStage(item.stage);
            return (
              <div
                key={item.id}
                className={`studio__pipe-item studio__pipe-item--${item.priority} ${item.starred ? "is-starred" : ""}`}
              >
                <div
                  className="studio__pipe-item-head"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="studio__pipe-item-left">
                    <span className="studio__pipe-stage-tag">{STAGE_LABELS[item.stage]}</span>
                    <span className="studio__pipe-platform-tag">
                      {PLATFORM_LABELS[item.platform]}
                    </span>
                    <span className="studio__pipe-item-idea">{item.idea}</span>
                  </div>
                  <div className="studio__pipe-item-right">
                    {item.priority === "high" && (
                      <span className="studio__pipe-priority">↑</span>
                    )}
                    {item.starred && <span className="studio__pipe-star">★</span>}
                    <span className="studio__pipe-chevron">{isExpanded ? "−" : "+"}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="studio__pipe-item-detail">
                    <div className="studio__pipe-meta-row">
                      <span>theme: {item.theme}</span>
                      <span>vibe: {item.vibe}</span>
                      <span>reuse: {item.repurposePotential}</span>
                      <span>added: {daysAgo(item.createdAt)}</span>
                      {item.postedAt && <span>posted: {daysAgo(item.postedAt)}</span>}
                      {item.outcome && (
                        <span className={`studio__pipe-outcome studio__pipe-outcome--${item.outcome}`}>
                          {item.outcome === "winner" ? "★ winner" : "✗ flop"}
                        </span>
                      )}
                    </div>

                    {item.mediaDataUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <div className="studio__pipe-media">
                        <img
                          src={item.mediaDataUrl}
                          alt="reference"
                          className="studio__pipe-media-img"
                        />
                        <button
                          type="button"
                          className="studio__ghost studio__ghost--sm studio__ghost--danger"
                          onClick={() => removeMedia(item.id)}
                        >
                          remove
                        </button>
                      </div>
                    )}
                    {item.caption && (
                      <div className="studio__pipe-caption">
                        <div className="studio__pipe-caption-label">caption</div>
                        <div className="studio__pipe-caption-text">{item.caption}</div>
                      </div>
                    )}
                    {item.mediaNote && (
                      <div className="studio__pipe-caption">
                        <div className="studio__pipe-caption-label">shot notes</div>
                        <div className="studio__pipe-caption-text">{item.mediaNote}</div>
                      </div>
                    )}
                    {item.scheduledFor && (
                      <div className="studio__pipe-caption">
                        <div className="studio__pipe-caption-label">scheduled for</div>
                        <div className="studio__pipe-caption-text">{item.scheduledFor}</div>
                      </div>
                    )}
                    {item.performanceNote && (
                      <div className="studio__pipe-caption studio__pipe-caption--highlight">
                        <div className="studio__pipe-caption-label">performance</div>
                        <div className="studio__pipe-caption-text">{item.performanceNote}</div>
                      </div>
                    )}
                    <div className="studio__pipe-actions">
                      {next && (
                        <button className="studio__ghost" onClick={() => moveStage(item.id, next)}>
                          → {STAGE_LABELS[next]}
                        </button>
                      )}
                      <button
                        className="studio__ghost"
                        onClick={() => onSendToGenerator(item.idea, item.platform)}
                      >
                        generate
                      </button>
                      {(item.stage === "posted" || item.stage === "repurpose") && (
                        <>
                          <button
                            className={`studio__ghost ${item.outcome === "winner" ? "is-on" : ""}`}
                            onClick={() => setOutcome(item.id, "winner")}
                            title="mark as winner"
                          >
                            ★ winner
                          </button>
                          <button
                            className={`studio__ghost ${item.outcome === "flop" ? "is-on" : ""}`}
                            onClick={() => setOutcome(item.id, "flop")}
                            title="mark as flop"
                          >
                            ✗ flop
                          </button>
                        </>
                      )}
                      <button className="studio__ghost" onClick={() => triggerUpload(item.id)}>
                        {item.mediaDataUrl ? "replace photo" : "+ photo"}
                      </button>
                      <button className="studio__ghost" onClick={() => toggleStar(item.id)}>
                        {item.starred ? "★" : "☆"}
                      </button>
                      <button
                        className="studio__ghost studio__ghost--danger"
                        onClick={() => deleteItem(item.id)}
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
