"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { DropTimesPanel } from "@/components/studio/drop-times-panel";
import { BuyersView } from "@/components/studio/buyers-view";
import { PipelineView } from "@/components/studio/pipeline-view";
import { TodayView } from "@/components/studio/today-view";
import {
  BUYERS_KEY,
  PIPELINE_KEY,
  SEEDED_BUYERS,
  SEEDED_KEY,
  SEEDED_PIPELINE,
  type Buyer,
  type PipelineItem,
} from "@/lib/studio/types";
import {
  ACTIVITY_KEY,
  clearActivity,
  loadActivity,
  logActivity,
  onActivity,
  onToast,
  timeAgo,
  toast,
  type ActivityEntry,
  type ToastTone,
} from "@/lib/studio/activity";

type Tab = "today" | "generator" | "pipeline" | "buyers";
type PlatformId = "feetfinder" | "feet_ig" | "personal_ig";
type ToneId = "dangerous" | "luxury" | "playful" | "soft" | "professional" | "personal";

const PLATFORM_OPTIONS: { id: PlatformId; label: string; sub: string }[] = [
  { id: "feetfinder", label: "SylveeSoles23FeetFinder", sub: "the register" },
  { id: "feet_ig", label: "SylveeSoles23", sub: "the bait" },
  { id: "personal_ig", label: "adhbeezy.exe", sub: "the brand" },
];

const TONE_OPTIONS: { id: ToneId; label: string; whisper: string }[] = [
  { id: "dangerous", label: "Dangerous", whisper: "low and loaded" },
  { id: "luxury", label: "Luxury", whisper: "expensive air" },
  { id: "playful", label: "Playful", whisper: "wink, no cheese" },
  { id: "soft", label: "Soft", whisper: "2am, slow pulse" },
  { id: "professional", label: "Professional", whisper: "portfolio grade" },
  { id: "personal", label: "Personal", whisper: "real human, real warmth" },
];

type Caption = {
  caption: string;
  cta?: string | null;
  hashtags?: string[] | null;
  note?: string | null;
};

type PlatformResult = {
  platform: PlatformId;
  directions: string[];
  captions: Caption[];
};

type GenerateResponse = {
  ok: boolean;
  error?: string;
  data?: {
    results: PlatformResult[];
    strategy?: string;
    story_slides?: string[];
    shot_notes?: string;
    follow_up_hook?: string;
  };
};

type HistoryEntry = {
  id: string;
  idea: string;
  tone: ToneId;
  platforms: PlatformId[];
  at: number;
  data: GenerateResponse["data"];
  starred?: boolean;
  shippedAt?: number | null;
  shippedTo?: PlatformId | null;
};

const HISTORY_KEY = "gigasuede.history.v1";
const PREFS_KEY = "gigasuede.prefs.v1";
const DRAFT_KEY = "gigasuede.draft.v1";
const TAB_KEY = "gigasuede.tab.v1";

function bundleCaption(c: Caption): string {
  return [
    c.caption,
    c.cta ? `\n\n${c.cta}` : "",
    c.hashtags?.length ? `\n\n${c.hashtags.map((t) => `#${t}`).join(" ")}` : "",
  ].join("");
}

function bundleAll(results: PlatformResult[]): string {
  return results
    .map((r) => {
      const head = `— ${platformLabel(r.platform)} —`;
      const body = r.captions.map((c, i) => `${i + 1}.\n${bundleCaption(c)}`).join("\n\n");
      return `${head}\n\n${body}`;
    })
    .join("\n\n\n");
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(h: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 30)));
}

function platformLabel(id: PlatformId) {
  return PLATFORM_OPTIONS.find((p) => p.id === id)?.label ?? id;
}

function Divider() {
  return (
    <div className="studio__divider" aria-hidden="true">
      <span className="studio__divider-rule" />
      <span className="studio__divider-ornament">✦ ❖ ✦</span>
      <span className="studio__divider-rule" />
    </div>
  );
}

type Variant = "v1" | "v2" | "v3";

const VARIANTS: { id: Variant; label: string; desc: string }[] = [
  { id: "v1", label: "Marquee", desc: "marigold neon" },
  { id: "v2", label: "Velvet", desc: "pumpkin plush" },
  { id: "v3", label: "Press", desc: "ember stamp" },
];

const HOUSE_NOTES = [
  "Hooks land in the first five words or they die in the first five seconds.",
  "Premium isn't loud. Premium is the room going quiet when you walk in.",
  "If a caption could come from any creator on earth, rewrite it.",
  "The brand voice you can't copy is the only one worth having.",
  "Atlanta energy: smooth, confident, never thirsty.",
  "Don't sell the foot. Sell the room the foot is in.",
  "If it sounds like a content tool wrote it, throw it out.",
  "Two posts a week, both undeniable, beats seven mediocre.",
  "Everything is a setup for the close. Even the silence.",
  "The math has to math. If it doesn't math, delete.",
  "Post like you've been there before. Because you have.",
  "Delulu is, in fact, the solulu.",
  "No one's watching the way you think they are. Go crazy.",
  "If you have to explain the joke, cut the post.",
  "The algorithm is a very anxious teenager. Feed it accordingly.",
  "Not every drop is a banger. But every drop is a receipt.",
  "Ate. Left no crumbs. Came back for the plate.",
  "Road work ahead? Yeah, I sure hope it does.",
];

// Rotating microcopy used in lots of tiny places. Jester to taste.
const COOKING_STATES = [
  "cooking…",
  "letting him cook…",
  "stirring the pot…",
  "the math is mathing…",
  "reading the room…",
  "finding the angle…",
  "consulting the oracle…",
  "sharpening the hook…",
  "whispering sweet nothings…",
  "in the lab…",
  "asking the algorithm nicely…",
];

const PLACEHOLDERS = [
  "just shot a crazy set… something dangerous for feetfinder and clean for the personal page",
  "need something that makes them DM me first…",
  "late night energy — something soft but heavy",
  "help me cook a tease that doesn't feel thirsty",
  "turn yesterday's drop into something stronger for the personal page",
  "need a caption that sells without being corny — ate and left no crumbs",
  "something dangerous but still luxury. think: walking in a room in silence",
  "it's wednesday, my dudes. write accordingly.",
];

const MODES = [
  "MODE · LET HIM COOK",
  "MODE · ATE AND LEFT NO CRUMBS",
  "MODE · SPEAKING AURA",
  "MODE · JESTERMAXXING",
  "MODE · PREMIUM UNLEADED",
  "MODE · DELULU IS THE SOLULU",
  "MODE · NO THOUGHTS, JUST CAPTIONS",
  "MODE · READING THE ROOM",
  "MODE · BROADSHEET CERTIFIED",
  "MODE · IT'S GIVING",
  "MODE · SIGMA AFTERNOON",
  "MODE · ROAD WORK AHEAD",
];

const VINE_QUOTES = [
  "road work ahead? yeah, I sure hope it does.",
  "it is wednesday, my dudes.",
  "I don't need friends. they disappoint me.",
  "adam.",
  "it's an avocado. thaaaaanks.",
  "chris, is that a weed?",
  "not the bees!",
  "what are thoooose?",
  "welcome to chili's.",
  "stahp, I could've dropped my croissant.",
  "merry chrysler.",
  "gimme my hat back.",
  "hi welcome to chili's.",
  "two bros, chillin' in a hot tub.",
  "hurricane katrina? more like hurricane tortilla.",
];

const TAB_LABELS: Record<Tab, string> = {
  today: "today",
  generator: "generate",
  pipeline: "pipeline",
  buyers: "buyers",
};

// ---------- Smart brain-dump classification ----------
type Inference = {
  platforms: PlatformId[];
  tone: ToneId | null;
  goal: string | null;
};

function classifyIdea(idea: string): Inference {
  const s = idea.toLowerCase();
  const p = new Set<PlatformId>();
  let tone: ToneId | null = null;
  let goal: string | null = null;

  // Platform signals
  if (/\b(finsta|personal|voice|atlanta|portfolio|brand|bilingual|german)\b/.test(s))
    p.add("personal_ig");
  if (/\b(tease|teasing|aesthetic|story|reel|ig|instagram|feed|bait|scroll)\b/.test(s))
    p.add("feet_ig");
  if (/\b(feetfinder|ff|register|buyer|custom|paying|unlock|tip|sell|dm)\b/.test(s))
    p.add("feetfinder");
  if (/\b(heel|heels|arch|bare|sole|ankle|foot|feet|toe|polish)\b/.test(s)) {
    p.add("feetfinder");
    p.add("feet_ig");
  }

  // Tone signals
  if (/\b(dangerous|heavy|loaded|threat|intense|sharp|edge)\b/.test(s)) tone = "dangerous";
  else if (/\b(luxury|premium|rich|expensive|designer|louboutin|silk|velvet|gold|marble)\b/.test(s))
    tone = "luxury";
  else if (/\b(soft|intimate|gentle|quiet|2am|late night|morning|slow)\b/.test(s)) tone = "soft";
  else if (/\b(playful|wink|fun|cheeky|light|cute)\b/.test(s)) tone = "playful";
  else if (/\b(personal|real|diary|honest|warm|grounded)\b/.test(s)) tone = "personal";
  else if (/\b(professional|clean|portfolio|sharp|polished)\b/.test(s)) tone = "professional";

  // Goal signals
  if (/\b(buyer|custom|dm|unlock|sell|close|convert|tip)\b/.test(s)) goal = "conversion";
  else if (/\b(tease|hook|scroll|engagement|reach|growth|follow)\b/.test(s)) goal = "attention";
  else if (/\b(repurpose|reuse|old|refresh|callback|winner)\b/.test(s)) goal = "repurpose";

  return {
    platforms: p.size > 0 ? Array.from(p) : [],
    tone,
    goal,
  };
}

export function StudioApp() {
  const [syncState, setSyncState] = useState<"idle" | "pulling" | "synced" | "offline">("idle");

  // Seed pipeline and buyers synchronously on first visit — before any child renders.
  // Must run before TodayView mounts or it will read empty localStorage.
  useState(() => {
    if (typeof window === "undefined") return null;
    if (!localStorage.getItem(SEEDED_KEY)) {
      if (!localStorage.getItem(PIPELINE_KEY))
        localStorage.setItem(PIPELINE_KEY, JSON.stringify(SEEDED_PIPELINE));
      if (!localStorage.getItem(BUYERS_KEY))
        localStorage.setItem(BUYERS_KEY, JSON.stringify(SEEDED_BUYERS));
      localStorage.setItem(SEEDED_KEY, "1");
    }
    return null;
  });

  const [tab, setTab] = useState<Tab>("today");
  const [variant, setVariant] = useState<Variant>("v1");
  const [idea, setIdea] = useState("");
  const [platforms, setPlatforms] = useState<PlatformId[]>(["feetfinder", "feet_ig"]);
  const [tone, setTone] = useState<ToneId>("dangerous");
  const [wantCTA, setWantCTA] = useState(true);
  const [wantHashtags, setWantHashtags] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PlatformResult[] | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [storySlides, setStorySlides] = useState<string[] | null>(null);
  const [shotNotes, setShotNotes] = useState<string | null>(null);
  const [followUpHook, setFollowUpHook] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [vaultQuery, setVaultQuery] = useState("");
  const [vaultStarsOnly, setVaultStarsOnly] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cookingIdx, setCookingIdx] = useState(0);
  const [modeIdx, setModeIdx] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);
  const [vineQuote, setVineQuote] = useState<string | null>(null);
  const [placeholderIdx] = useState(() =>
    Math.floor(Math.random() * PLACEHOLDERS.length),
  );
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const ideaRef = useRef<HTMLTextAreaElement | null>(null);

  // ---- Toasts ----
  type ToastItem = { id: string; message: string; tone: ToastTone };
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // ---- Activity feed ----
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [activityOpen, setActivityOpen] = useState(false);
  const [activitySeen, setActivitySeen] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const v = Number(localStorage.getItem("gigasuede.activity.seen.v1") ?? "0");
    return Number.isFinite(v) ? v : 0;
  });

  // ---- Nav badge counts (re-read from localStorage on mount + on activity) ----
  const [navCounts, setNavCounts] = useState<Record<Tab, number>>({
    today: 0,
    generator: 0,
    pipeline: 0,
    buyers: 0,
  });

  // ---- Sliding tab indicator ----
  const navRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    today: null,
    generator: null,
    pipeline: null,
    buyers: null,
  });
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    setHistory(loadHistory());
    try {
      const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null");
      if (prefs) {
        if (prefs.platforms) setPlatforms(prefs.platforms);
        if (prefs.tone) setTone(prefs.tone);
        if (typeof prefs.wantCTA === "boolean") setWantCTA(prefs.wantCTA);
        if (typeof prefs.wantHashtags === "boolean") setWantHashtags(prefs.wantHashtags);
        if (prefs.variant === "v1" || prefs.variant === "v2" || prefs.variant === "v3") {
          setVariant(prefs.variant);
        }
      }
    } catch {}
    // Restore draft idea (autosave)
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) setIdea(draft);
    const fromUrl = new URLSearchParams(window.location.search).get("v");
    if (fromUrl === "v1" || fromUrl === "v2" || fromUrl === "v3") setVariant(fromUrl);
    // Restore last active tab
    const savedTab = localStorage.getItem(TAB_KEY) as Tab | null;
    if (savedTab && ["today", "generator", "pipeline", "buyers"].includes(savedTab)) {
      setTab(savedTab);
    }
  }, []);

  // Cross-device sync: pull remote state on mount, then mirror every localStorage change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let alive = true;
    let lastHashes: Record<string, string> = {};

    const keyMap: { local: string; remote: "pipeline" | "buyers" | "history" }[] = [
      { local: PIPELINE_KEY, remote: "pipeline" },
      { local: BUYERS_KEY, remote: "buyers" },
      { local: HISTORY_KEY, remote: "history" },
    ];

    async function pull() {
      setSyncState("pulling");
      try {
        for (const { local, remote } of keyMap) {
          const res = await fetch(`/api/studio/sync?key=${remote}`, { cache: "no-store" });
          if (!res.ok) {
            setSyncState("offline");
            return;
          }
          const json = (await res.json()) as { ok: boolean; value: unknown };
          if (json.ok && json.value != null) {
            const str = JSON.stringify(json.value);
            localStorage.setItem(local, str);
            lastHashes[local] = str;
          } else {
            // Server has nothing — push whatever we have locally.
            const existing = localStorage.getItem(local);
            if (existing) {
              await fetch("/api/studio/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: remote, value: JSON.parse(existing) }),
              });
              lastHashes[local] = existing;
            }
          }
        }
        if (alive) {
          setSyncState("synced");
          // Trigger a re-read in children by updating history state (the only child that lives here).
          setHistory(loadHistory());
        }
      } catch {
        setSyncState("offline");
      }
    }

    async function pushIfChanged() {
      for (const { local, remote } of keyMap) {
        const current = localStorage.getItem(local) ?? "";
        if (current && current !== lastHashes[local]) {
          lastHashes[local] = current;
          try {
            await fetch("/api/studio/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: remote, value: JSON.parse(current) }),
            });
          } catch {
            setSyncState("offline");
          }
        }
      }
    }

    pull();
    const interval = setInterval(pushIfChanged, 3000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave the idea draft on every keystroke.
  useEffect(() => {
    if (idea) localStorage.setItem(DRAFT_KEY, idea);
    else localStorage.removeItem(DRAFT_KEY);
  }, [idea]);

  // ⌘K command palette — global shortcut.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setVineQuote(null);
        setShowHistory(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ platforms, tone, wantCTA, wantHashtags, variant }),
    );
  }, [platforms, tone, wantCTA, wantHashtags, variant]);

  // ---- Toast event listener ----
  useEffect(() => {
    return onToast((message, tn) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, tone: tn }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    });
  }, []);

  // ---- Activity feed: load + subscribe ----
  function recomputeNavCounts() {
    if (typeof window === "undefined") return;
    try {
      const pipeline = JSON.parse(localStorage.getItem(PIPELINE_KEY) ?? "[]") as PipelineItem[];
      const buyers = JSON.parse(localStorage.getItem(BUYERS_KEY) ?? "[]") as Buyer[];
      const ready = pipeline.filter((i) => i.stage === "shot" || i.stage === "edited").length;
      const followUps = buyers.filter((b) => b.followUpDue).length;
      const todayCount = ready + followUps;
      setNavCounts({
        today: todayCount,
        generator: 0,
        pipeline: ready,
        buyers: followUps,
      });
    } catch {}
  }

  useEffect(() => {
    setActivity(loadActivity());
    recomputeNavCounts();
    const off = onActivity(() => {
      setActivity(loadActivity());
      recomputeNavCounts();
    });
    // Also sync from cross-tab storage events
    function onStorage(e: StorageEvent) {
      if (e.key === ACTIVITY_KEY) setActivity(loadActivity());
      if (e.key === PIPELINE_KEY || e.key === BUYERS_KEY) recomputeNavCounts();
    }
    window.addEventListener("storage", onStorage);
    return () => {
      off();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Recompute counts when entering/leaving views (in case child mutated localStorage)
  useEffect(() => {
    recomputeNavCounts();
  }, [tab]);

  // Mark activity as seen when the user opens the feed
  useEffect(() => {
    if (activityOpen && activity.length > 0) {
      const latest = activity[0]?.at ?? Date.now();
      setActivitySeen(latest);
      localStorage.setItem("gigasuede.activity.seen.v1", String(latest));
    }
  }, [activityOpen, activity]);

  const unreadActivity = activity.filter((a) => a.at > activitySeen).length;

  // ---- Sliding tab indicator measurement ----
  const measureIndicator = useCallback(() => {
    const el = tabRefs.current[tab];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({ left: r.left - navRect.left, width: r.width });
  }, [tab]);

  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator, navCounts]);

  useEffect(() => {
    function onResize() {
      measureIndicator();
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureIndicator]);

  function switchTab(t: Tab) {
    setTab(t);
    localStorage.setItem(TAB_KEY, t);
  }

  function pickVariant(v: Variant) {
    setVariant(v);
    const url = new URL(window.location.href);
    url.searchParams.set("v", v);
    window.history.replaceState({}, "", url.toString());
  }

  function togglePlatform(id: PlatformId) {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  // Called from Pipeline and Buyers views — loads an idea into the generator and switches tabs.
  function sendToGenerator(newIdea: string, platform: PlatformId) {
    setIdea(newIdea);
    setPlatforms([platform]);
    switchTab("generator");
    requestAnimationFrame(() => {
      ideaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      ideaRef.current?.focus();
    });
  }

  async function generate() {
    if (!idea.trim() || platforms.length === 0) return;
    setBusy(true);
    setError(null);
    setResults(null);
    setStrategy(null);
    setStorySlides(null);
    setShotNotes(null);
    setFollowUpHook(null);
    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, platforms, tone, wantCTA, wantHashtags }),
      });
      const json: GenerateResponse = await res.json();
      if (!res.ok || !json.ok || !json.data) {
        setError(`${json.error ?? "something broke"} — blame mercury, try again.`);
        return;
      }
      setResults(json.data.results ?? []);
      setStrategy(json.data.strategy ?? null);
      setStorySlides(json.data.story_slides ?? null);
      setShotNotes(json.data.shot_notes ?? null);
      setFollowUpHook(json.data.follow_up_hook ?? null);
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        idea,
        tone,
        platforms,
        at: Date.now(),
        data: json.data,
      };
      const next = [entry, ...history];
      setHistory(next);
      saveHistory(next);
      logActivity(
        "generate",
        `cooked captions for ${platforms.length} room${platforms.length > 1 ? "s" : ""} · ${tone}`,
        { tone: "good" },
      );
      // Once a generation is in the vault, the draft has done its job — clear it.
      localStorage.removeItem(DRAFT_KEY);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} — the wifi ate it. try again.`
          : "the wifi ate it. try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      generate();
    }
  }

  async function copyText(text: string, label?: string) {
    await navigator.clipboard.writeText(text);
    toast(label ? `copied · ${label}` : "copied to clipboard", "good");
  }

  function loadFromHistory(entry: HistoryEntry) {
    setIdea(entry.idea);
    setTone(entry.tone);
    setPlatforms(entry.platforms);
    setResults(entry.data?.results ?? null);
    setStrategy(entry.data?.strategy ?? null);
    setStorySlides(entry.data?.story_slides ?? null);
    setShotNotes(entry.data?.shot_notes ?? null);
    setFollowUpHook(entry.data?.follow_up_hook ?? null);
    setShowHistory(false);
  }

  function toggleStar(id: string) {
    setHistory((prev) => {
      const next = prev.map((h) => (h.id === id ? { ...h, starred: !h.starred } : h));
      saveHistory(next);
      return next;
    });
  }

  function deleteEntry(id: string) {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      saveHistory(next);
      return next;
    });
  }

  function repurposeFromHistory(entry: HistoryEntry) {
    const repurposeIdea = `repurpose: "${entry.idea}" — find a new angle, stronger version, or cross-platform adaptation`;
    setIdea(repurposeIdea);
    setShowHistory(false);
    switchTab("generator");
    requestAnimationFrame(() => {
      ideaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      ideaRef.current?.focus();
    });
  }

  function clearDraft() {
    setIdea("");
    localStorage.removeItem(DRAFT_KEY);
    ideaRef.current?.focus();
  }

  const filteredHistory = history.filter((h) => {
    if (vaultStarsOnly && !h.starred) return false;
    if (!vaultQuery.trim()) return true;
    const q = vaultQuery.trim().toLowerCase();
    return (
      h.idea.toLowerCase().includes(q) ||
      h.tone.toLowerCase().includes(q) ||
      h.platforms.some((p) => platformLabel(p).toLowerCase().includes(q))
    );
  });

  async function logout() {
    await fetch("/api/studio/auth", { method: "DELETE" });
    window.location.reload();
  }

  function exportBackup() {
    const dump: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("gigasuede.")) continue;
      try {
        dump[k] = JSON.parse(localStorage.getItem(k) ?? "null");
      } catch {
        dump[k] = localStorage.getItem(k);
      }
    }
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), data: dump }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gigasuede-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function enableNotifications() {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      new Notification("Gigasuede", { body: "Notifications already on — you're set." });
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      new Notification("Gigasuede", { body: "Drop-time alerts armed." });
      // Schedule reminders for today's drop times
      scheduleDropReminders();
    }
  }

  function scheduleDropReminders() {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    // Re-read pipeline for scheduled items happening today/tomorrow
    try {
      const pipeline = JSON.parse(localStorage.getItem(PIPELINE_KEY) ?? "[]") as {
        idea: string;
        scheduledFor?: string;
        stage: string;
      }[];
      const now = Date.now();
      pipeline.forEach((i) => {
        if (i.stage !== "scheduled" || !i.scheduledFor) return;
        const target = new Date(i.scheduledFor + "T20:00:00").getTime();
        const delay = target - now;
        if (delay > 0 && delay < 24 * 3600 * 1000) {
          setTimeout(() => {
            new Notification("Time to drop", { body: i.idea.slice(0, 80) });
          }, delay);
        }
      });
    } catch {}
  }

  const TICKER_TEXT =
    "★ GIGASUEDE STUDIO ★ A PRIVATE BROADCAST OUT OF ATLANTA, GA ★ THE REGISTER · THE BAIT · THE BRAND ★ LET HIM COOK ★ NO CRUMBS LEFT ★ IT'S GIVING BROADSHEET ENERGY ★ THE MATH IS MATHING ★ ROAD WORK AHEAD? I SURE HOPE IT DOES ★ PREMIUM WITH A WINK ★ HE'S A 10 BUT HE WRITES HIS OWN CAPTIONS ★ DELULU IS THE SOLULU ★ ATL CERTIFIED ★ ATE AND LEFT NO CRUMBS ★ JESTERMAXX UNTIL FURTHER NOTICE ★ MERRY CHRYSLER ★ ";

  // Rotates client-side after mount so hydration stays clean.
  const [houseNoteIdx, setHouseNoteIdx] = useState(0);
  useEffect(() => {
    setHouseNoteIdx(Math.floor(Math.random() * HOUSE_NOTES.length));
    const id = setInterval(
      () => setHouseNoteIdx((i) => (i + 1) % HOUSE_NOTES.length),
      9000,
    );
    return () => clearInterval(id);
  }, []);
  const houseNote = HOUSE_NOTES[houseNoteIdx];

  // Rotate the "MODE" chip in the hero every ~6s.
  useEffect(() => {
    setModeIdx(Math.floor(Math.random() * MODES.length));
    const id = setInterval(() => setModeIdx((i) => (i + 1) % MODES.length), 6500);
    return () => clearInterval(id);
  }, []);
  const mode = MODES[modeIdx];

  // Rotate the "cooking…" label while the generator is busy.
  useEffect(() => {
    if (!busy) {
      setCookingIdx(0);
      return;
    }
    const id = setInterval(
      () => setCookingIdx((i) => (i + 1) % COOKING_STATES.length),
      1500,
    );
    return () => clearInterval(id);
  }, [busy]);
  const cookingLabel = COOKING_STATES[cookingIdx];
  const placeholder = PLACEHOLDERS[placeholderIdx];

  // Click the logo 5 times for a random Vine quote.
  function onLogoClick() {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setVineQuote(VINE_QUOTES[Math.floor(Math.random() * VINE_QUOTES.length)]);
        return 0;
      }
      return next;
    });
  }

  return (
    <div className={`studio ${variant}`}>
      <div className="studio__ticker" aria-hidden="true">
        <div className="studio__ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="studio__ticker-text">
              {TICKER_TEXT}
            </span>
          ))}
        </div>
      </div>

      <div className="studio__topbar">
        <div className="studio__variant-bar" role="tablist" aria-label="theme variant">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`studio__variant-btn ${variant === v.id ? "is-on" : ""}`}
              onClick={() => pickVariant(v.id)}
              aria-pressed={variant === v.id}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="studio__header-actions">
          <span
            className={`studio__sync studio__sync--${syncState}`}
            title={`sync: ${syncState}`}
            aria-label={`sync ${syncState}`}
          >
            {syncState === "synced" ? "●" : syncState === "pulling" ? "◐" : syncState === "offline" ? "○" : "·"}
          </span>
          <button
            className="studio__ghost"
            onClick={() => setPaletteOpen(true)}
            aria-label="open command palette"
          >
            menu
          </button>
          <button
            className="studio__ghost studio__ghost--activity"
            onClick={() => setActivityOpen(true)}
            aria-label="activity feed"
          >
            activity
            {unreadActivity > 0 ? (
              <span className="studio__activity-pip" aria-label={`${unreadActivity} new`}>
                {unreadActivity > 9 ? "9+" : unreadActivity}
              </span>
            ) : null}
          </button>
          <button className="studio__ghost" onClick={() => setShowHistory((v) => !v)}>
            vault · {history.length}
          </button>
          <button className="studio__ghost" onClick={logout}>
            lock
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="studio__nav" aria-label="studio sections" ref={navRef}>
        {(["today", "generator", "pipeline", "buyers"] as Tab[]).map((t) => {
          const count = navCounts[t];
          return (
            <button
              key={t}
              ref={(el) => {
                tabRefs.current[t] = el;
              }}
              type="button"
              className={`studio__nav-tab ${tab === t ? "is-on" : ""}`}
              onClick={() => switchTab(t)}
            >
              <span className="studio__nav-tab-label">{TAB_LABELS[t]}</span>
              {count > 0 ? (
                <span
                  className={`studio__nav-badge ${
                    t === "today" || t === "buyers" ? "studio__nav-badge--alert" : ""
                  }`}
                  aria-label={`${count} pending`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
        <span
          className="studio__nav-indicator"
          aria-hidden="true"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: `${indicator.width}px`,
          }}
        />
      </nav>

      <header className="studio__hero">
        <div className="studio__hero-rule">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="studio__hero-eyebrow">Voice 01 — Atlanta, GA · A Private Broadcast</div>
        <div key={modeIdx} className="studio__hero-mode">{mode}</div>
        <div className="studio__hero-mark-wrap">
          <div className="studio__bulbs studio__bulbs--top" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
          <h1 className="studio__hero-mark" onClick={onLogoClick}>Gigasuede</h1>
          <div className="studio__bulbs studio__bulbs--bottom" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        <div className="studio__hero-sub">
          <span>The</span>
          <em>Content</em>
          <span>Engine</span>
        </div>
        <div className="studio__hero-rule">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="studio__hero-blurb">
          Three voices. One desk. Captions in, captions out — finished, on-brand, and ready to
          drop. <em>Bitte schön.</em>
        </p>
      </header>

      {/* ========== TODAY ========== */}
      {tab === "today" && <TodayView onNavigate={(t) => switchTab(t)} />}

      {/* ========== PIPELINE ========== */}
      {tab === "pipeline" && <PipelineView onSendToGenerator={sendToGenerator} />}

      {/* ========== BUYERS ========== */}
      {tab === "buyers" && <BuyersView onSendToGenerator={sendToGenerator} />}

      {/* ========== GENERATOR ========== */}
      {tab === "generator" && (
        <>
          {/* ACT 00 — DROP TIMES */}
          <DropTimesPanel />

          <Divider />

          {/* ACT I — THE SPARK */}
          <section className="studio__act studio__act--left">
            <div className="studio__act-numeral" aria-hidden="true">
              01
            </div>
            <div className="studio__act-body">
              <div className="studio__act-label">
                <span className="studio__act-tag">Act One</span>
                <h2 className="studio__act-title">The Spark</h2>
                <p className="studio__act-desc">
                  Drop the raw thought. One line, three, doesn&apos;t matter. Type how you talk —
                  typos, half-thoughts, all of it. We polish on the other side.
                </p>
              </div>
              <div className="studio__paper">
                <div className="studio__paper-tape" aria-hidden="true">
                  ★ ★ ★
                </div>
                <textarea
                  ref={ideaRef}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={placeholder}
                  className="studio__textarea"
                  rows={5}
                />
                {(() => {
                  if (idea.trim().length < 10) return null;
                  const inf = classifyIdea(idea);
                  if (
                    inf.platforms.length === 0 &&
                    !inf.tone &&
                    !inf.goal
                  )
                    return null;
                  return (
                    <div className="studio__chips" aria-label="inferred suggestions">
                      <span className="studio__chips-label">inferred</span>
                      {inf.platforms.map((p) => {
                        const active = platforms.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            className={`studio__chip ${active ? "is-on" : ""}`}
                            onClick={() => {
                              if (!active)
                                setPlatforms((prev) => Array.from(new Set([...prev, p])));
                            }}
                          >
                            {PLATFORM_OPTIONS.find((x) => x.id === p)?.sub ?? p}
                          </button>
                        );
                      })}
                      {inf.tone && (
                        <button
                          type="button"
                          className={`studio__chip ${tone === inf.tone ? "is-on" : ""}`}
                          onClick={() => setTone(inf.tone!)}
                        >
                          {inf.tone}
                        </button>
                      )}
                      {inf.goal && (
                        <span className="studio__chip studio__chip--meta">goal · {inf.goal}</span>
                      )}
                    </div>
                  );
                })()}
                <div className="studio__paper-foot">
                  <span className="studio__paper-tip">
                    tap send · or ⌘⏎ if you&apos;ve got a keyboard
                  </span>
                  <div className="studio__paper-actions">
                    {idea ? (
                      <button type="button" className="studio__ghost" onClick={clearDraft}>
                        clear
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="studio__send"
                      onClick={generate}
                      disabled={busy || !idea.trim() || platforms.length === 0}
                    >
                      {busy ? cookingLabel : "send →"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* ACT II — THE STAGE */}
          <section className="studio__act studio__act--right">
            <div className="studio__act-numeral" aria-hidden="true">
              02
            </div>
            <div className="studio__act-body">
              <div className="studio__act-label">
                <span className="studio__act-tag">Act Two</span>
                <h2 className="studio__act-title">The Stage</h2>
                <p className="studio__act-desc">
                  Pick your rooms. Each one gets its own voice. Pick one, pick three, pick the
                  whole house — we&apos;ll write to whoever&apos;s listening.
                </p>
              </div>
              <div className="studio__stage">
                {PLATFORM_OPTIONS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`studio__stage-card ${platforms.includes(p.id) ? "is-on" : ""}`}
                    style={{ ["--tilt" as string]: `${(idx - 1) * 1.5}deg` }}
                    onClick={() => togglePlatform(p.id)}
                  >
                    <span className="studio__stage-num">0{idx + 1}</span>
                    <span className="studio__stage-name">{p.label}</span>
                    <span className="studio__stage-sub">{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ACT III — THE TONE */}
          <section className="studio__act studio__act--center">
            <div className="studio__act-numeral" aria-hidden="true">
              03
            </div>
            <div className="studio__act-body">
              <div className="studio__act-label studio__act-label--center">
                <span className="studio__act-tag">Act Three</span>
                <h2 className="studio__act-title">The Tone</h2>
                <p className="studio__act-desc">
                  Set the temperature. One pick. The whole drop bends around it.
                </p>
              </div>
              <div className="studio__tones">
                {TONE_OPTIONS.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`studio__tone ${tone === t.id ? "is-on" : ""}`}
                    style={{ ["--tilt" as string]: `${(idx % 2 === 0 ? -1 : 1) * 1.5}deg` }}
                    onClick={() => setTone(t.id)}
                  >
                    <span className="studio__tone-label">{t.label}</span>
                    <span className="studio__tone-whisper">{t.whisper}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ACT IV — SHIP IT */}
          <section className="studio__act studio__act--center studio__act--final">
            <div className="studio__act-numeral" aria-hidden="true">
              04
            </div>
            <div className="studio__act-body">
              <div className="studio__act-label studio__act-label--center">
                <span className="studio__act-tag">Act Four</span>
                <h2 className="studio__act-title">Ship It</h2>
                <p className="studio__act-desc">
                  Pull the lever. Captions arrive finished — copy, paste, post, profit. Back at it
                  again at Krispy Kreme.
                </p>
              </div>
              <div className="studio__finishers">
                <label className="studio__toggle">
                  <input
                    type="checkbox"
                    checked={wantCTA}
                    onChange={(e) => setWantCTA(e.target.checked)}
                  />
                  <span>Include CTA</span>
                </label>
                <label className="studio__toggle">
                  <input
                    type="checkbox"
                    checked={wantHashtags}
                    onChange={(e) => setWantHashtags(e.target.checked)}
                  />
                  <span>Include Hashtags</span>
                </label>
              </div>
              <div className="studio__lever">
                <button
                  className="studio__go"
                  disabled={busy || !idea.trim() || platforms.length === 0}
                  onClick={generate}
                >
                  {busy ? cookingLabel : "Generate"}
                </button>
              </div>
              <p className="studio__lever-foot">
                Tap send up top, or ⌘⏎ from the Spark. We don&apos;t make you scroll.
              </p>
            </div>
          </section>

          {/* HOUSE NOTES — rotating editor's column */}
          <footer className="studio__colophon">
            <div className="studio__colophon-rule" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="studio__colophon-eyebrow">House Notes</div>
            <p key={houseNoteIdx} className="studio__colophon-quote">
              &ldquo;{houseNote}&rdquo;
            </p>
            <div className="studio__colophon-meta">
              Gigasuede Studio · Voice 01 · Atlanta, GA · A private broadcast for one
            </div>
          </footer>

          {error ? <div className="studio__error">{error}</div> : null}

          <div ref={resultsRef}>
            {results ? (
              <section className="studio__results">
                {strategy ? <div className="studio__strategy">{strategy}</div> : null}

                {/* Content Pack — story slides, shot notes, follow-up hook */}
                {(storySlides?.length || shotNotes || followUpHook) ? (
                  <div className="studio__pack">
                    {storySlides?.length ? (
                      <div className="studio__pack-block">
                        <div className="studio__pack-label">Story Slides</div>
                        <ul className="studio__pack-list">
                          {storySlides.map((s, i) => (
                            <li key={i} className="studio__pack-item">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {shotNotes ? (
                      <div className="studio__pack-block">
                        <div className="studio__pack-label">Shot Notes</div>
                        <div className="studio__pack-body">{shotNotes}</div>
                      </div>
                    ) : null}
                    {followUpHook ? (
                      <div className="studio__pack-block">
                        <div className="studio__pack-label">Follow-up Hook</div>
                        <div className="studio__pack-body">{followUpHook}</div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="studio__results-toolbar">
                  <button
                    type="button"
                    className="studio__ghost"
                    onClick={() => copyText(bundleAll(results))}
                  >
                    copy bundle
                  </button>
                </div>
                {results.map((r) => (
                  <div key={r.platform} className="studio__platform-block">
                    <div className="studio__platform-header">
                      <span className="studio__platform-name">{platformLabel(r.platform)}</span>
                      {r.directions?.length ? (
                        <span className="studio__directions">{r.directions.join(" · ")}</span>
                      ) : null}
                    </div>
                    <div className="studio__captions">
                      {r.captions.map((c, i) => {
                        const full = bundleCaption(c);
                        return (
                          <article key={i} className="studio__caption">
                            <pre className="studio__caption-text">{c.caption}</pre>
                            {c.cta ? <div className="studio__caption-cta">{c.cta}</div> : null}
                            {c.hashtags?.length ? (
                              <div className="studio__caption-tags">
                                {c.hashtags.map((t) => `#${t}`).join(" ")}
                              </div>
                            ) : null}
                            {c.note ? (
                              <div className="studio__caption-note">{c.note}</div>
                            ) : null}
                            <div className="studio__caption-actions">
                              <button
                                onClick={() => copyText(full)}
                                className="studio__ghost"
                              >
                                copy
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="studio__regen">
                  <button
                    className="studio__go studio__go--alt"
                    onClick={generate}
                    disabled={busy}
                  >
                    {busy ? cookingLabel : "regenerate"}
                  </button>
                </div>
              </section>
            ) : null}
          </div>
        </>
      )}

      {/* VAULT OVERLAY — accessible from any tab */}
      {showHistory ? (
        <div
          className="studio__overlay studio__vault-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="the vault"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="studio__vault-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="studio__vault-header">
              <div>
                <div className="studio__vault-eyebrow">★ the vault ★</div>
                <h2 className="studio__vault-title">
                  {history.length} {history.length === 1 ? "receipt" : "receipts"}
                </h2>
              </div>
              <button
                type="button"
                className="studio__ghost"
                onClick={() => setShowHistory(false)}
                aria-label="close vault"
              >
                close
              </button>
            </header>
            <div className="studio__vault-toolbar">
              <input
                type="search"
                value={vaultQuery}
                onChange={(e) => setVaultQuery(e.target.value)}
                placeholder="search — idea, tone, platform"
                className="studio__vault-search"
              />
              <button
                type="button"
                className={`studio__ghost ${vaultStarsOnly ? "is-on" : ""}`}
                onClick={() => setVaultStarsOnly((v) => !v)}
                aria-pressed={vaultStarsOnly}
              >
                {vaultStarsOnly ? "★ stars" : "☆ stars"}
              </button>
            </div>
            <div className="studio__vault-body">
              {filteredHistory.length === 0 ? (
                <div className="studio__empty">
                  {history.length === 0
                    ? "the vault is giving nothing. cook something first."
                    : "no matches. try different words."}
                </div>
              ) : (
                filteredHistory.map((h) => (
                  <div key={h.id} className="studio__vault-row">
                    <button
                      type="button"
                      className="studio__vault-item"
                      onClick={() => {
                        loadFromHistory(h);
                        switchTab("generator");
                      }}
                    >
                      <div className="studio__vault-item-idea">{h.idea}</div>
                      <div className="studio__vault-item-meta">
                        {h.platforms.map(platformLabel).join(" · ")} · {h.tone}
                        {h.shippedAt ? " · shipped" : ""}
                      </div>
                    </button>
                    <div className="studio__vault-row-actions">
                      <button
                        type="button"
                        className="studio__ghost studio__ghost--sm"
                        onClick={() => repurposeFromHistory(h)}
                        aria-label="repurpose this idea"
                        title="repurpose"
                      >
                        ↺
                      </button>
                      <button
                        type="button"
                        className="studio__ghost studio__ghost--sm"
                        onClick={() => toggleStar(h.id)}
                        aria-label={h.starred ? "unstar" : "star"}
                      >
                        {h.starred ? "★" : "☆"}
                      </button>
                      <button
                        type="button"
                        className="studio__ghost studio__ghost--sm studio__ghost--danger"
                        onClick={() => deleteEntry(h.id)}
                        aria-label="delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {vineQuote ? (
        <div
          className="studio__palette"
          role="dialog"
          aria-modal="true"
          onClick={() => setVineQuote(null)}
        >
          <div
            className="studio__palette-card studio__vine-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="studio__palette-eyebrow">★ certified nonsense ★</div>
            <p className="studio__vine-quote">&ldquo;{vineQuote}&rdquo;</p>
            <div className="studio__vine-sub">— vine, 2013–2017, real ones know</div>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => setVineQuote(null)}
            >
              <span>back to the grind</span>
              <kbd>esc</kbd>
            </button>
          </div>
        </div>
      ) : null}

      {paletteOpen ? (
        <div
          className="studio__palette"
          role="dialog"
          aria-modal="true"
          onClick={() => setPaletteOpen(false)}
        >
          <div className="studio__palette-card" onClick={(e) => e.stopPropagation()}>
            <div className="studio__palette-eyebrow">Command Palette</div>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                switchTab("today");
              }}
            >
              <span>What&apos;s the move today</span>
              <kbd>today</kbd>
            </button>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                switchTab("generator");
                requestAnimationFrame(() => {
                  ideaRef.current?.focus();
                  ideaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                });
              }}
            >
              <span>Focus the spark</span>
              <kbd>cook</kbd>
            </button>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                generate();
              }}
              disabled={busy || !idea.trim() || platforms.length === 0}
            >
              <span>Generate</span>
              <kbd>⌘⏎</kbd>
            </button>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                switchTab("generator");
                setShowHistory(true);
              }}
            >
              <span>Open the vault</span>
              <kbd>{history.length}</kbd>
            </button>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                switchTab("pipeline");
              }}
            >
              <span>Pipeline</span>
              <kbd>queue</kbd>
            </button>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                switchTab("buyers");
              }}
            >
              <span>Buyers</span>
              <kbd>CRM</kbd>
            </button>
            {results ? (
              <button
                type="button"
                className="studio__palette-item"
                onClick={() => {
                  copyText(bundleAll(results));
                  setPaletteOpen(false);
                }}
              >
                <span>Copy bundle</span>
                <kbd>copy</kbd>
              </button>
            ) : null}
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                className="studio__palette-item"
                onClick={() => {
                  pickVariant(v.id);
                  setPaletteOpen(false);
                }}
              >
                <span>Switch to {v.label}</span>
                <kbd>{v.desc}</kbd>
              </button>
            ))}
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                exportBackup();
              }}
            >
              <span>Export backup</span>
              <kbd>.json</kbd>
            </button>
            <button
              type="button"
              className="studio__palette-item"
              onClick={() => {
                setPaletteOpen(false);
                enableNotifications();
              }}
            >
              <span>Enable drop alerts</span>
              <kbd>notify</kbd>
            </button>
            <button
              type="button"
              className="studio__palette-item studio__palette-item--danger"
              onClick={() => {
                setPaletteOpen(false);
                logout();
              }}
            >
              <span>Lock the studio</span>
              <kbd>bye</kbd>
            </button>
          </div>
        </div>
      ) : null}

      {/* ========== ACTIVITY FEED OVERLAY ========== */}
      {activityOpen ? (
        <div
          className="studio__overlay studio__activity-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="activity feed"
          onClick={() => setActivityOpen(false)}
        >
          <div
            className="studio__activity-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="studio__vault-header">
              <div>
                <div className="studio__vault-eyebrow">★ activity ★</div>
                <h2 className="studio__vault-title">
                  {activity.length} {activity.length === 1 ? "event" : "events"}
                </h2>
              </div>
              <div className="studio__activity-head-actions">
                {activity.length > 0 && (
                  <button
                    type="button"
                    className="studio__ghost studio__ghost--sm"
                    onClick={() => {
                      clearActivity();
                      setActivity([]);
                      toast("activity cleared");
                    }}
                  >
                    clear
                  </button>
                )}
                <button
                  type="button"
                  className="studio__ghost"
                  onClick={() => setActivityOpen(false)}
                  aria-label="close activity"
                >
                  close
                </button>
              </div>
            </header>
            <div className="studio__activity-body">
              {activity.length === 0 ? (
                <div className="studio__empty">
                  no moves yet. cook something — every action shows up here.
                </div>
              ) : (
                <ul className="studio__activity-list">
                  {activity.map((a) => (
                    <li
                      key={a.id}
                      className={`studio__activity-row studio__activity-row--${a.kind}`}
                    >
                      <span className="studio__activity-kind">{a.kind}</span>
                      <span className="studio__activity-msg">{a.message}</span>
                      <span className="studio__activity-time">{timeAgo(a.at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* ========== TOASTS ========== */}
      <div className="studio__toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`studio__toast studio__toast--${t.tone}`}>
            <span className="studio__toast-dot" aria-hidden="true" />
            <span className="studio__toast-msg">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
