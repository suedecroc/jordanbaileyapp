// GET /api/studio/drop-times — public read of the latest drop-times snapshot.
// Reads from Supabase studio_kv (key=drop_times) and falls back to the curated
// file if the table is empty or unreachable.

import { isStudioAuthed } from "@/lib/studio/auth";
import { readDropTimes } from "@/lib/studio/drop-times-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isStudioAuthed())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const data = await readDropTimes();
  return Response.json({ ok: true, data });
}
