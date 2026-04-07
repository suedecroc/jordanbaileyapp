// Vercel Cron → refreshes the drop_times snapshot weekly via Claude + web search.
//
// Schedule: see vercel.json (Mondays 10:00 UTC = 5–6am EST depending on DST).
// Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
//
// Strategy: ask Claude with the web_search server tool to research the
// current consensus best post times for each platform, return strict JSON
// matching DropTimesPayload, then upsert into Supabase studio_kv.

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

import {
  DROP_TIMES_FALLBACK,
  type DropTimesPayload,
} from "@/lib/studio/drop-times";
import { writeDropTimes } from "@/lib/studio/drop-times-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Web search + reasoning can take a while.
export const maxDuration = 300;

const SYSTEM = `You are the research arm of Gigasuede Studio — a private content engine for an Atlanta-based creator running Instagram, Reddit, TikTok, and FeetFinder accounts.

Your job: research the CURRENT consensus best posting times for each platform, in EST (America/New_York), for every weekday Monday through Sunday. Use web_search aggressively. Pull from sources published in the last 12 months when possible (Hootsuite, Sprout Social, Later, Buffer, Influencer Marketing Hub, Reddit creator threads, TikTok creator forums).

For FeetFinder there is no published analytics — synthesize from creator-community heuristics and the general adult-content traffic pattern (late evening EST + weekends).

OUTPUT — return ONLY a single JSON object, no prose, no markdown fences, no preamble. It must match this exact shape:

{
  "tagline": "<one short editorial line for the panel header — under 100 chars>",
  "platforms": [
    {
      "key": "instagram" | "reddit" | "tiktok" | "feetfinder",
      "label": "<display label>",
      "blurb": "<one to two sentences, voicey but professional, specific to this platform's current peak windows>",
      "week": [
        {
          "day": "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun",
          "slots": [
            { "time": "<e.g. '8:30 PM'>", "hour24": <0-23>, "confidence": "high" | "medium" | "low", "note": "<one line, under 90 chars, witty Atlanta-creator voice, no emojis>" }
          ]
        }
      ]
    }
  ]
}

RULES
- All times in EST. Display strings must use 12-hour format with AM/PM.
- 1–2 slots per day per platform. No more than 2.
- Cover all 7 days for all 4 platforms (28 day-rows total).
- Notes are short, sharp, voice-first. Atlanta energy. No emojis. No corny influencer lingo. No drug references.
- Confidence: 'high' for well-documented prime windows, 'medium' for solid-but-soft, 'low' for niche or experimental slots.
- Return ONLY the JSON object. Nothing else.`;

const USER = `Run web_search now and produce the freshest drop-times JSON for the four platforms. Strict JSON only.`;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "ANTHROPIC_API_KEY not set" },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      system: SYSTEM,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 8,
        } as unknown as Anthropic.Tool,
      ],
      messages: [{ role: "user", content: USER }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { text: string }).text)
      .join("\n")
      .trim();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return Response.json(
        { ok: false, error: "Model returned no JSON", raw: text },
        { status: 502 },
      );
    }

    let parsed: Partial<DropTimesPayload>;
    try {
      parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch {
      return Response.json(
        { ok: false, error: "Model returned invalid JSON", raw: text },
        { status: 502 },
      );
    }

    if (!parsed.platforms || !Array.isArray(parsed.platforms) || parsed.platforms.length === 0) {
      return Response.json(
        { ok: false, error: "Parsed payload missing platforms", raw: parsed },
        { status: 502 },
      );
    }

    const payload: DropTimesPayload = {
      updatedAt: new Date().toISOString(),
      source: "claude-web",
      tagline: parsed.tagline ?? DROP_TIMES_FALLBACK.tagline,
      platforms: parsed.platforms.map((p) => ({
        ...p,
        source: "claude-web" as const,
      })),
    };

    await writeDropTimes(payload);
    return Response.json({ ok: true, data: payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
