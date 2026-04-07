"use client";

import { useEffect, useRef, useState } from "react";

import { DropTimesPanel } from "@/components/studio/drop-times-panel";

type PlatformId = "feetfinder" | "feet_ig" | "personal_ig";
type ToneId = "dangerous" | "luxury" | "playful" | "soft" | "professional" | "personal";

const PLATFORM_OPTIONS: { id: PlatformId; label: string; sub: string }[] = [
  { id: "feetfinder", label: "SylveeSoles23FeetFinder", sub: "the register" },
  { id: "feet_ig", label: "SylveeSoles23", sub: "the bait" },
  { id: "personal_ig", label: "atl_computah", sub: "the brand" },
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
  data?: { results: PlatformResult[]; strategy?: string };
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
];

export function StudioApp() {
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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [vaultQuery, setVaultQuery] = useState("");
  const [vaultStarsOnly, setVaultStarsOnly] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const ideaRef = useRef<HTMLTextAreaElement | null>(null);

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

  async function generate() {
    if (!idea.trim() || platforms.length === 0) return;
    setBusy(true);
    setError(null);
    setResults(null);
    setStrategy(null);
    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, platforms, tone, wantCTA, wantHashtags }),
      });
      const json: GenerateResponse = await res.json();
      if (!res.ok || !json.ok || !json.data) {
        setError(json.error ?? "Generation failed");
        return;
      }
      setResults(json.data.results ?? []);
      setStrategy(json.data.strategy ?? null);
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
      // Once a generation is in the vault, the draft has done its job — clear it.
      localStorage.removeItem(DRAFT_KEY);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
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

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  function loadFromHistory(entry: HistoryEntry) {
    setIdea(entry.idea);
    setTone(entry.tone);
    setPlatforms(entry.platforms);
    setResults(entry.data?.results ?? null);
    setStrategy(entry.data?.strategy ?? null);
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

  const TICKER_TEXT =
    "★ GIGASUEDE STUDIO ★ A PRIVATE BROADCAST OUT OF ATLANTA, GA ★ THE REGISTER · THE BAIT · THE BRAND ★ HAPPY FRIDAY TO YOU ★ ROAD WORK AHEAD? I SURE HOPE IT DOES ★ PREMIUM WITH A WINK ★ ";

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

  return (
    <div className={`studio ${variant}`}>
      <div className="studio__ticker" aria-hidden="true">
        <div className="studio__ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="studio__ticker-text">{TICKER_TEXT}</span>
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
          <button className="studio__ghost" onClick={() => setShowHistory((v) => !v)}>
            {showHistory ? "close" : `vault · ${history.length}`}
          </button>
          <button className="studio__ghost" onClick={logout}>
            lock
          </button>
        </div>
      </div>

      <header className="studio__hero">
        <div className="studio__hero-rule">
          <span /><span /><span /><span /><span />
        </div>
        <div className="studio__hero-eyebrow">Voice 01 — Atlanta, GA · A Private Broadcast</div>
        <div className="studio__hero-mark-wrap">
          <div className="studio__bulbs studio__bulbs--top" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => <i key={i} />)}
          </div>
          <h1 className="studio__hero-mark">Gigasuede</h1>
          <div className="studio__bulbs studio__bulbs--bottom" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => <i key={i} />)}
          </div>
        </div>
        <div className="studio__hero-sub">
          <span>The</span>
          <em>Content</em>
          <span>Engine</span>
        </div>
        <div className="studio__hero-rule">
          <span /><span /><span /><span /><span />
        </div>
        <p className="studio__hero-blurb">
          Three voices. One desk. Captions in, captions out — finished, on-brand,
          and ready to drop. <em>Bitte schön.</em>
        </p>
      </header>

      {/* ACT 00 — DROP TIMES (Field Report) */}
      <DropTimesPanel />

      <Divider />

      {showHistory ? (
        <section className="studio__history">
          <div className="studio__vault-toolbar">
            <input
              type="search"
              value={vaultQuery}
              onChange={(e) => setVaultQuery(e.target.value)}
              placeholder="search the vault — idea, tone, platform"
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
          {filteredHistory.length === 0 ? (
            <div className="studio__empty">
              {history.length === 0 ? "the vault is empty" : "no matches"}
            </div>
          ) : (
            filteredHistory.map((h) => (
              <div key={h.id} className="studio__history-row">
                <button
                  className="studio__history-item"
                  onClick={() => loadFromHistory(h)}
                >
                  <div className="studio__history-idea">{h.idea}</div>
                  <div className="studio__history-meta">
                    {h.platforms.map(platformLabel).join(" · ")} · {h.tone}
                    {h.shippedAt ? " · shipped" : ""}
                  </div>
                </button>
                <div className="studio__history-actions">
                  <button
                    type="button"
                    className="studio__ghost"
                    onClick={() => toggleStar(h.id)}
                    aria-label={h.starred ? "unstar" : "star"}
                  >
                    {h.starred ? "★" : "☆"}
                  </button>
                  <button
                    type="button"
                    className="studio__ghost"
                    onClick={() => deleteEntry(h.id)}
                    aria-label="delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      ) : null}

      {/* ACT I — THE SPARK */}
      <section className="studio__act studio__act--left">
        <div className="studio__act-numeral" aria-hidden="true">01</div>
        <div className="studio__act-body">
          <div className="studio__act-label">
            <span className="studio__act-tag">Act One</span>
            <h2 className="studio__act-title">The Spark</h2>
            <p className="studio__act-desc">
              Drop the raw thought. One line, three, doesn&apos;t matter. Type how you
              talk — typos, half-thoughts, all of it. We polish on the other side.
            </p>
          </div>
          <div className="studio__paper">
            <div className="studio__paper-tape" aria-hidden="true">★ ★ ★</div>
            <textarea
              ref={ideaRef}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={onKey}
              placeholder="just shot a crazy set… something dangerous for feetfinder and clean for the personal page"
              className="studio__textarea"
              rows={5}
            />
            <div className="studio__paper-foot">
              <span>⌘ + ⏎ to send it · ⌘ + K for the palette</span>
              {idea ? (
                <button type="button" className="studio__ghost" onClick={clearDraft}>
                  clear
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ACT II — THE STAGE */}
      <section className="studio__act studio__act--right">
        <div className="studio__act-numeral" aria-hidden="true">02</div>
        <div className="studio__act-body">
          <div className="studio__act-label">
            <span className="studio__act-tag">Act Two</span>
            <h2 className="studio__act-title">The Stage</h2>
            <p className="studio__act-desc">
              Pick your rooms. Each one gets its own voice. Pick one, pick three,
              pick the whole house — we&apos;ll write to whoever&apos;s listening.
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
        <div className="studio__act-numeral" aria-hidden="true">03</div>
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
                style={{ ["--tilt" as string]: `${((idx % 2 === 0 ? -1 : 1) * 1.5)}deg` }}
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
        <div className="studio__act-numeral" aria-hidden="true">04</div>
        <div className="studio__act-body">
          <div className="studio__act-label studio__act-label--center">
            <span className="studio__act-tag">Act Four</span>
            <h2 className="studio__act-title">Ship It</h2>
            <p className="studio__act-desc">
              Pull the lever. Captions arrive finished — copy, paste, post, profit.
              Back at it again at Krispy Kreme.
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
              {busy ? "Cooking…" : "Generate"}
            </button>
          </div>
          <p className="studio__lever-foot">
            ⌘ + ⏎ from the Spark works too. We don&apos;t make you click.
          </p>
        </div>
      </section>

      {/* HOUSE NOTES — rotating editor's column */}
      <footer className="studio__colophon">
        <div className="studio__colophon-rule" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="studio__colophon-eyebrow">House Notes</div>
        <p key={houseNoteIdx} className="studio__colophon-quote">&ldquo;{houseNote}&rdquo;</p>
        <div className="studio__colophon-meta">
          Gigasuede Studio · Voice 01 · Atlanta, GA · A private broadcast for one
        </div>
      </footer>

      {error ? <div className="studio__error">{error}</div> : null}

      <div ref={resultsRef}>
        {results ? (
          <section className="studio__results">
            {strategy ? <div className="studio__strategy">{strategy}</div> : null}
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
                    <span className="studio__directions">
                      {r.directions.join(" · ")}
                    </span>
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
                        {c.note ? <div className="studio__caption-note">{c.note}</div> : null}
                        <div className="studio__caption-actions">
                          <button onClick={() => copyText(full)} className="studio__ghost">
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
              <button className="studio__go studio__go--alt" onClick={generate} disabled={busy}>
                {busy ? "cooking…" : "regenerate"}
              </button>
            </div>
          </section>
        ) : null}
      </div>

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
                ideaRef.current?.focus();
                ideaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              <span>Focus the spark</span>
              <kbd>Spark</kbd>
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
                setShowHistory(true);
              }}
            >
              <span>Open the vault</span>
              <kbd>{history.length}</kbd>
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
              className="studio__palette-item studio__palette-item--danger"
              onClick={() => {
                setPaletteOpen(false);
                logout();
              }}
            >
              <span>Lock the studio</span>
              <kbd>lock</kbd>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
