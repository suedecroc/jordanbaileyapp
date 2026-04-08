// Gigasuede Studio — activity log + toast emitter.
// Tiny client-only event bus so any view can announce what just happened.

export type ActivityKind =
  | "generate"
  | "copy"
  | "ship"
  | "stage"
  | "outcome"
  | "buyer"
  | "spend"
  | "followup"
  | "pipeline"
  | "system";

export type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  message: string;
  at: number;
};

export type ToastTone = "default" | "good" | "warn" | "danger";

export const ACTIVITY_KEY = "gigasuede.activity.v1";
const ACTIVITY_LIMIT = 80;

const ACTIVITY_EVENT = "studio:activity";
const TOAST_EVENT = "studio:toast";

function isClient() {
  return typeof window !== "undefined";
}

export function loadActivity(): ActivityEntry[] {
  if (!isClient()) return [];
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function clearActivity() {
  if (!isClient()) return;
  localStorage.removeItem(ACTIVITY_KEY);
  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT));
}

function persist(entries: ActivityEntry[]) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries.slice(0, ACTIVITY_LIMIT)));
}

// Log + (optionally) toast in one shot.
export function logActivity(
  kind: ActivityKind,
  message: string,
  opts?: { toast?: boolean; tone?: ToastTone },
) {
  if (!isClient()) return;
  const entry: ActivityEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    kind,
    message,
    at: Date.now(),
  };
  const next = [entry, ...loadActivity()];
  persist(next);
  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT, { detail: entry }));
  if (opts?.toast !== false) {
    toast(message, opts?.tone ?? "default");
  }
}

export function toast(message: string, tone: ToastTone = "default") {
  if (!isClient()) return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, tone } }));
}

export function onActivity(cb: (e: ActivityEntry | null) => void) {
  if (!isClient()) return () => {};
  const handler = (e: Event) => {
    const ce = e as CustomEvent<ActivityEntry | undefined>;
    cb(ce.detail ?? null);
  };
  window.addEventListener(ACTIVITY_EVENT, handler);
  return () => window.removeEventListener(ACTIVITY_EVENT, handler);
}

export function onToast(cb: (msg: string, tone: ToastTone) => void) {
  if (!isClient()) return () => {};
  const handler = (e: Event) => {
    const ce = e as CustomEvent<{ message: string; tone: ToastTone }>;
    cb(ce.detail.message, ce.detail.tone);
  };
  window.addEventListener(TOAST_EVENT, handler);
  return () => window.removeEventListener(TOAST_EVENT, handler);
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
