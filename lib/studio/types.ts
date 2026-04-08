// Gigasuede Studio — shared types and seed data for Pipeline, Buyers, and Today views.

import type { ToneId } from "./prompt";

export type ContentStage =
  | "idea"
  | "drafted"
  | "shot"
  | "edited"
  | "scheduled"
  | "posted"
  | "repurpose";

export type Priority = "high" | "medium" | "low";

export type Outcome = "winner" | "flop" | null;

export type PipelineItem = {
  id: string;
  stage: ContentStage;
  idea: string;
  platform: "feetfinder" | "feet_ig" | "personal_ig";
  theme: string;
  vibe: string;
  caption?: string;
  mediaNote?: string;
  mediaDataUrl?: string;
  priority: Priority;
  createdAt: number;
  scheduledFor?: string;
  postedAt?: number;
  performanceNote?: string;
  repurposePotential: Priority;
  starred?: boolean;
  outcome?: Outcome;
};

export type SpendEntry = {
  at: number;
  amount: number;
  note?: string;
};

export type Buyer = {
  id: string;
  handle: string;
  spendLevel: "whale" | "regular" | "occasional" | "lurker";
  interests: string[];
  tonePreference: ToneId;
  customRequestHistory: string[];
  lastContactAt: number;
  followUpNote?: string;
  followUpDue?: boolean;
  reliability: "solid" | "flaky" | "unknown";
  conversionContent: string[];
  notes: string;
  totalSpend?: string;
  spendLog?: SpendEntry[];
};

const NOW = Date.now();
const DAY = 86_400_000;

export const SEEDED_PIPELINE: PipelineItem[] = [
  {
    id: "seed-p1",
    stage: "shot",
    idea: "black heel set with dramatic window light — rich, heavy, ready",
    platform: "feetfinder",
    theme: "luxury",
    vibe: "dangerous",
    mediaNote:
      "Shoot at golden hour. Tight crop on ankle line. No filter — let the light do the work.",
    priority: "high",
    createdAt: NOW - DAY * 2,
    repurposePotential: "high",
    starred: true,
  },
  {
    id: "seed-p2",
    stage: "drafted",
    idea: "bare arch close-up, soft focus, minimal edit — something intimate",
    platform: "feet_ig",
    theme: "soft aesthetic",
    vibe: "soft",
    caption: "the kind of quiet that asks something of you.",
    priority: "medium",
    createdAt: NOW - DAY * 4,
    repurposePotential: "medium",
  },
  {
    id: "seed-p3",
    stage: "idea",
    idea: "late night energy drop — personal finsta, raw, no polish",
    platform: "personal_ig",
    theme: "personality",
    vibe: "personal",
    priority: "medium",
    createdAt: NOW - DAY * 1,
    repurposePotential: "low",
  },
  {
    id: "seed-p4",
    stage: "posted",
    idea: "ankle chain set — gold on deep brown, luxury vacation energy",
    platform: "feetfinder",
    theme: "luxury travel",
    vibe: "luxury",
    caption: "Arrived. The room knew it before I did.",
    priority: "high",
    createdAt: NOW - DAY * 8,
    postedAt: NOW - DAY * 6,
    performanceNote: "Strong engagement. 3 custom requests same day. Repurpose the angle.",
    repurposePotential: "high",
    starred: true,
    outcome: "winner",
  },
  {
    id: "seed-p5",
    stage: "edited",
    idea: "red sole close-up — Louboutin energy without saying it",
    platform: "feet_ig",
    theme: "designer energy",
    vibe: "luxury",
    mediaNote: "Red bottom facing camera, slight toe point, marble floor.",
    priority: "high",
    createdAt: NOW - DAY * 3,
    repurposePotential: "high",
  },
  {
    id: "seed-p6",
    stage: "repurpose",
    idea: "bath soak set from three months ago — still one of the strongest performers",
    platform: "feetfinder",
    theme: "sensory / ritual",
    vibe: "soft",
    performanceNote: "Still getting saves. Push to IG or shoot a refreshed version.",
    priority: "medium",
    createdAt: NOW - DAY * 90,
    postedAt: NOW - DAY * 88,
    repurposePotential: "high",
    starred: true,
    outcome: "winner",
  },
  {
    id: "seed-p7",
    stage: "scheduled",
    idea: "contrast set: bare + heeled — same pose, two different energies",
    platform: "feet_ig",
    theme: "contrast",
    vibe: "playful",
    caption: "before. after. which one stays?",
    scheduledFor: new Date(NOW + DAY * 1).toISOString().split("T")[0],
    priority: "high",
    createdAt: NOW - DAY * 2,
    repurposePotential: "medium",
  },
];

export const SEEDED_BUYERS: Buyer[] = [
  {
    id: "seed-b1",
    handle: "@velvetrequest",
    spendLevel: "whale",
    interests: ["heels", "arch shots", "luxury aesthetic", "customs"],
    tonePreference: "luxury",
    customRequestHistory: [
      "black heel set, close ankle crop",
      "red sole walk video, 30 seconds",
      "bath soak 60-second custom",
    ],
    lastContactAt: NOW - DAY * 3,
    followUpDue: false,
    reliability: "solid",
    conversionContent: ["luxury tone captions", "texture-heavy descriptions", "scarcity framing"],
    notes:
      "Responds to scarcity language. Always tips above the ask. Never haggles. Best buyer on the list.",
    totalSpend: "$420+",
    spendLog: [
      { at: NOW - DAY * 3, amount: 85, note: "custom heel set" },
      { at: NOW - DAY * 11, amount: 120, note: "bath soak custom" },
      { at: NOW - DAY * 24, amount: 95, note: "red sole walk" },
      { at: NOW - DAY * 40, amount: 60, note: "tip on drop" },
      { at: NOW - DAY * 55, amount: 60, note: "tip" },
    ],
  },
  {
    id: "seed-b2",
    handle: "@softtourist",
    spendLevel: "regular",
    interests: ["soft aesthetic", "bare arch", "natural light", "lifestyle"],
    tonePreference: "soft",
    customRequestHistory: [
      "morning light arch set",
      "reading + feet on couch — lifestyle vibe",
    ],
    lastContactAt: NOW - DAY * 9,
    followUpDue: true,
    followUpNote: "Mentioned wanting a summer set. Follow up with a preview tease — don't oversell.",
    reliability: "solid",
    conversionContent: ["soft tone", "lifestyle framing", "personal ig cross-posts"],
    notes:
      "Takes a while to commit but always follows through. Loves the personal voice. Never pressure.",
    totalSpend: "$180",
    spendLog: [
      { at: NOW - DAY * 9, amount: 40, note: "morning light set" },
      { at: NOW - DAY * 28, amount: 75, note: "lifestyle custom" },
      { at: NOW - DAY * 50, amount: 65 },
    ],
  },
  {
    id: "seed-b3",
    handle: "@quicktip99",
    spendLevel: "occasional",
    interests: ["heels", "glossy finish", "posed sets"],
    tonePreference: "dangerous",
    customRequestHistory: ["stiletto walk — 15 seconds"],
    lastContactAt: NOW - DAY * 21,
    followUpDue: true,
    followUpNote: "Went quiet after last post. Re-engage with a dangerous-tone drop.",
    reliability: "unknown",
    conversionContent: ["dangerous tone", "short captions", "direct CTAs"],
    notes: "Tips fast but disappears. Good for impulse buys, not reliable for customs.",
    totalSpend: "$65",
    spendLog: [
      { at: NOW - DAY * 21, amount: 35, note: "stiletto walk tip" },
      { at: NOW - DAY * 38, amount: 30 },
    ],
  },
  {
    id: "seed-b4",
    handle: "@atmosthere_x",
    spendLevel: "whale",
    interests: ["editorial", "conceptual", "designer reference", "minimal"],
    tonePreference: "luxury",
    customRequestHistory: [
      "Louboutin reference set",
      "editorial — chair + floor tiles, no color correction",
      "marble + arch — architectural",
    ],
    lastContactAt: NOW - DAY * 5,
    followUpDue: false,
    reliability: "solid",
    conversionContent: ["editorial framing", "luxury restraint", "concept-first captions"],
    notes:
      "Treats this like buying art. Patience earns bigger sales. Never rush the close with this one.",
    totalSpend: "$580+",
    spendLog: [
      { at: NOW - DAY * 5, amount: 150, note: "Louboutin reference set" },
      { at: NOW - DAY * 18, amount: 200, note: "editorial — chair + floor" },
      { at: NOW - DAY * 35, amount: 140, note: "marble + arch" },
      { at: NOW - DAY * 60, amount: 90 },
    ],
  },
  {
    id: "seed-b5",
    handle: "@lurkermode_7",
    spendLevel: "lurker",
    interests: ["everything"],
    tonePreference: "playful",
    customRequestHistory: [],
    lastContactAt: NOW - DAY * 45,
    followUpDue: false,
    reliability: "unknown",
    conversionContent: [],
    notes: "Lots of views, no spend. Watch for a pattern before investing energy here.",
    totalSpend: "$0",
  },
];

export const PIPELINE_KEY = "gigasuede.pipeline.v1";
export const BUYERS_KEY = "gigasuede.buyers.v1";
export const SEEDED_KEY = "gigasuede.seeded.v1";
