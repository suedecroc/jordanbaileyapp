// Sync endpoint for pipeline / buyers / history.
// GET ?key=pipeline       → { ok, value }
// POST { key, value }     → { ok }
// Last-write-wins. Auth required.

import { NextRequest } from "next/server";

import { isStudioAuthed } from "@/lib/studio/auth";
import { readKV, writeKV, type SyncKey } from "@/lib/studio/studio-kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: SyncKey[] = ["pipeline", "buyers", "history"];

function isAllowed(k: string | null): k is SyncKey {
  return !!k && (ALLOWED as string[]).includes(k);
}

export async function GET(request: NextRequest) {
  if (!(await isStudioAuthed())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const key = request.nextUrl.searchParams.get("key");
  if (!isAllowed(key)) {
    return Response.json({ ok: false, error: "Bad key" }, { status: 400 });
  }
  const value = await readKV(key);
  return Response.json({ ok: true, value });
}

export async function POST(request: NextRequest) {
  if (!(await isStudioAuthed())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as
    | { key?: string; value?: unknown }
    | null;
  if (!body || !isAllowed(body.key ?? null)) {
    return Response.json({ ok: false, error: "Bad body" }, { status: 400 });
  }
  await writeKV(body.key as SyncKey, body.value);
  return Response.json({ ok: true });
}
