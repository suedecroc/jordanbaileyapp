import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

import { isStudioAuthed } from "@/lib/studio/auth";
import {
  buildUserMessage,
  PLATFORMS,
  PlatformId,
  SYSTEM_PROMPT,
  TONES,
  ToneId,
} from "@/lib/studio/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerateBody = {
  idea?: string;
  platforms?: string[];
  tone?: string;
  wantCTA?: boolean;
  wantHashtags?: boolean;
};

export async function POST(request: NextRequest) {
  if (!(await isStudioAuthed())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "ANTHROPIC_API_KEY not set" },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as GenerateBody | null;
  const idea = body?.idea?.trim();
  if (!idea) {
    return Response.json({ ok: false, error: "Idea is required" }, { status: 400 });
  }

  const platforms = (body?.platforms ?? []).filter(
    (p): p is PlatformId => p in PLATFORMS,
  );
  if (platforms.length === 0) {
    return Response.json(
      { ok: false, error: "Pick at least one platform" },
      { status: 400 },
    );
  }

  const tone: ToneId = (body?.tone && body.tone in TONES ? body.tone : "dangerous") as ToneId;

  const userMessage = buildUserMessage({
    idea,
    platforms,
    tone,
    wantCTA: body?.wantCTA ?? true,
    wantHashtags: body?.wantHashtags ?? false,
  });

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
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

    let parsed: unknown;
    try {
      parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch {
      return Response.json(
        { ok: false, error: "Model returned invalid JSON", raw: text },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, data: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
