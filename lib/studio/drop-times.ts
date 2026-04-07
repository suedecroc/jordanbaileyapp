// Gigasuede — DROP TIMES.
// Curated weekly schedule of optimal post times per platform, EST.
// This file is the FALLBACK. The cron at /api/studio/cron/refresh-drop-times
// rewrites the live values weekly into the studio_kv table in Supabase.

export type Confidence = "high" | "medium" | "low";

export type DropSlot = {
  /** Display string, EST. e.g. "8:30 PM" */
  time: string;
  /** 0–23 in EST, used for sorting and the dial graphic */
  hour24: number;
  confidence: Confidence;
  /** One-line rationale, Jordan voice. Keep it under 90 chars. */
  note: string;
};

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type DayDrops = {
  day: DayKey;
  slots: DropSlot[];
};

export type PlatformKey = "instagram" | "reddit" | "tiktok" | "feetfinder";

export type PlatformDrops = {
  key: PlatformKey;
  label: string;
  /** Short editorial blurb that runs above the table for that platform. */
  blurb: string;
  /** Provenance line. Curated = file, claude-web = refreshed by cron. */
  source: "curated" | "claude-web";
  week: DayDrops[];
};

export type DropTimesPayload = {
  /** ISO date — when this snapshot was generated. */
  updatedAt: string;
  /** Where this snapshot came from. */
  source: "curated" | "claude-web";
  /** Tagline shown on the panel header. */
  tagline: string;
  platforms: PlatformDrops[];
};

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function row(day: DayKey, slots: DropSlot[]): DayDrops {
  return { day, slots };
}

const INSTAGRAM: PlatformDrops = {
  key: "instagram",
  label: "Instagram",
  blurb:
    "Feed and reels both. Lunch break and after-dinner are still the kings — that's when the doomscrolling sets in.",
  source: "curated",
  week: [
    row("Mon", [
      { time: "11:00 AM", hour24: 11, confidence: "high", note: "Monday lunch scroll, the warm-up lap." },
      { time: "7:30 PM", hour24: 19, confidence: "high", note: "Couch-and-AirPods hour, prime real estate." },
    ]),
    row("Tue", [
      { time: "9:00 AM", hour24: 9, confidence: "high", note: "Commute window. They're stuck on 285, give them something." },
      { time: "8:00 PM", hour24: 20, confidence: "high", note: "Tuesday primetime — engagement peak across the week." },
    ]),
    row("Wed", [
      { time: "11:00 AM", hour24: 11, confidence: "high", note: "Hump-day brunch energy. Reels eat here." },
      { time: "7:00 PM", hour24: 19, confidence: "high", note: "Strongest single slot of the week. Don't miss it." },
    ]),
    row("Thu", [
      { time: "12:00 PM", hour24: 12, confidence: "high", note: "Lunch room, eyes on phones." },
      { time: "8:00 PM", hour24: 20, confidence: "medium", note: "Pre-Friday wind-down. Tease, don't dump." },
    ]),
    row("Fri", [
      { time: "10:00 AM", hour24: 10, confidence: "medium", note: "Coffee and fresh-Friday energy. Happy friday to you." },
      { time: "5:00 PM", hour24: 17, confidence: "medium", note: "Clock-out scroll. Catch them before plans hit." },
    ]),
    row("Sat", [
      { time: "11:00 AM", hour24: 11, confidence: "medium", note: "Slow brunch wave. Aesthetic posts over.salesy." },
    ]),
    row("Sun", [
      { time: "10:00 AM", hour24: 10, confidence: "medium", note: "Sunday morning church-or-bed scroll." },
      { time: "7:00 PM", hour24: 19, confidence: "high", note: "Sunday scaries primetime. They are looking for anything." },
    ]),
  ],
};

const TIKTOK: PlatformDrops = {
  key: "tiktok",
  label: "TikTok",
  blurb:
    "Hook in the first 1.2 seconds or it's gone. Early morning slots underperform here unless you're catching commuters with audio off.",
  source: "curated",
  week: [
    row("Mon", [
      { time: "6:00 PM", hour24: 18, confidence: "medium", note: "Easing into the week. Soft post, save the heat for Tues." },
    ]),
    row("Tue", [
      { time: "9:00 AM", hour24: 9, confidence: "high", note: "TikTok's documented Tuesday peak. Drop the cinematic one." },
      { time: "7:00 PM", hour24: 19, confidence: "high", note: "Tuesday evening — second wave hits hard." },
    ]),
    row("Wed", [
      { time: "7:00 AM", hour24: 7, confidence: "medium", note: "Early-bird shift workers. Audio-off content wins." },
      { time: "8:00 PM", hour24: 20, confidence: "high", note: "Wednesday couch crowd. Premium look performs." },
    ]),
    row("Thu", [
      { time: "12:00 PM", hour24: 12, confidence: "high", note: "Lunch break window — bingeable content lives here." },
      { time: "7:00 PM", hour24: 19, confidence: "high", note: "Pre-weekend buildup. Thursday is the secret Friday." },
    ]),
    row("Fri", [
      { time: "5:00 AM", hour24: 5, confidence: "medium", note: "Hootsuite's classic Friday 5am. Weird but it works." },
      { time: "1:00 PM", hour24: 13, confidence: "high", note: "Long-lunch Friday. Posting now buys you the weekend." },
    ]),
    row("Sat", [
      { time: "11:00 AM", hour24: 11, confidence: "medium", note: "Lazy Saturday wake-up scroll. Keep it light." },
      { time: "7:00 PM", hour24: 19, confidence: "high", note: "Saturday primetime — pregame for the going-out crowd." },
    ]),
    row("Sun", [
      { time: "7:00 AM", hour24: 7, confidence: "medium", note: "Sunday early scroll. Cinematic > chaotic." },
      { time: "4:00 PM", hour24: 16, confidence: "high", note: "Sunday afternoon dread. They will watch ANYTHING." },
    ]),
  ],
};

const REDDIT: PlatformDrops = {
  key: "reddit",
  label: "Reddit",
  blurb:
    "Reddit is a morning-and-late-night animal. Subreddit-specific is better than global, but 6–9am EST and 8–10pm EST are the safe bets across most niches.",
  source: "curated",
  week: [
    row("Mon", [
      { time: "6:00 AM", hour24: 6, confidence: "high", note: "East coast wake-up. New queue is empty, you can climb." },
      { time: "8:00 PM", hour24: 20, confidence: "high", note: "Monday wind-down doomscroll. Comments roll in." },
    ]),
    row("Tue", [
      { time: "7:00 AM", hour24: 7, confidence: "high", note: "Tuesday peak day — cleanest engagement window." },
      { time: "9:00 PM", hour24: 21, confidence: "high", note: "Late Tuesday — the upvote brigade is locked in." },
    ]),
    row("Wed", [
      { time: "6:00 AM", hour24: 6, confidence: "high", note: "Mid-week morning. Reddit is still half asleep, ride the wave." },
      { time: "9:00 PM", hour24: 21, confidence: "high", note: "Wednesday night — peak comment activity, peak conversion." },
    ]),
    row("Thu", [
      { time: "7:00 AM", hour24: 7, confidence: "high", note: "Thursday morning — sweet spot for day-long traction." },
      { time: "9:00 PM", hour24: 21, confidence: "medium", note: "Pre-Friday energy. Less competition than weekday peaks." },
    ]),
    row("Fri", [
      { time: "6:00 AM", hour24: 6, confidence: "medium", note: "Fresh Friday — slower start, reach builds through the day." },
      { time: "12:00 PM", hour24: 12, confidence: "medium", note: "Friday lunch escape. Posts age into the weekend." },
    ]),
    row("Sat", [
      { time: "8:00 AM", hour24: 8, confidence: "medium", note: "Saturday morning is sneaky. Less noise, longer shelf life." },
      { time: "8:00 PM", hour24: 20, confidence: "medium", note: "Saturday night-in crowd — the actual gold." },
    ]),
    row("Sun", [
      { time: "9:00 AM", hour24: 9, confidence: "high", note: "Sunday brunch-in-bed window. Reddit lights up." },
      { time: "7:00 PM", hour24: 19, confidence: "high", note: "Sunday night — strongest day of the week to post on Reddit." },
    ]),
  ],
};

const FEETFINDER: PlatformDrops = {
  key: "feetfinder",
  label: "FeetFinder",
  blurb:
    "Heuristic, not data — FF doesn't publish analytics. Late-night EST and weekends are the consensus from the creator community. Treat as a starting point, A/B from there.",
  source: "curated",
  week: [
    row("Mon", [
      { time: "10:00 PM", hour24: 22, confidence: "medium", note: "Monday wind-down. Buyers are home, alone, and feeling something." },
    ]),
    row("Tue", [
      { time: "10:00 PM", hour24: 22, confidence: "medium", note: "Tuesday late — payday-week energy starts building." },
      { time: "1:00 AM", hour24: 1, confidence: "low", note: "Insomnia tier. Smaller pool, higher intent." },
    ]),
    row("Wed", [
      { time: "11:00 PM", hour24: 23, confidence: "medium", note: "Hump night. Plant something premium before bed." },
    ]),
    row("Thu", [
      { time: "10:00 PM", hour24: 22, confidence: "high", note: "Thursday is the new Friday for FF spend. Confirmed pattern." },
      { time: "1:00 AM", hour24: 1, confidence: "low", note: "Late-night locked-in crowd. Big tippers live here." },
    ]),
    row("Fri", [
      { time: "11:00 PM", hour24: 23, confidence: "high", note: "Friday night home crowd. Intentional, ready to spend." },
      { time: "2:00 AM", hour24: 2, confidence: "medium", note: "Post-bar return scroll. Soft-close territory." },
    ]),
    row("Sat", [
      { time: "12:00 AM", hour24: 0, confidence: "high", note: "Saturday rolls in. Strongest spend window of the week." },
      { time: "11:00 PM", hour24: 23, confidence: "high", note: "Saturday-night second wave. Stay up for it." },
    ]),
    row("Sun", [
      { time: "9:00 PM", hour24: 21, confidence: "high", note: "Sunday scaries → impulse buys. Be there for it." },
      { time: "12:00 AM", hour24: 0, confidence: "medium", note: "Late Sunday rollover. Soft close, weekly subscribers reset." },
    ]),
  ],
};

export const DROP_TIMES_FALLBACK: DropTimesPayload = {
  updatedAt: "2026-04-07T00:00:00.000Z",
  source: "curated",
  tagline: "When the people are looking. EST, every day, refreshed every Monday.",
  platforms: [INSTAGRAM, TIKTOK, REDDIT, FEETFINDER],
};

export const ALL_DAYS = DAYS;
