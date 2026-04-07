// Storage helpers for the studio's tiny key/value needs.
// Backed by a single Supabase table:
//
//   create table if not exists studio_kv (
//     key text primary key,
//     value jsonb not null,
//     updated_at timestamptz not null default now()
//   );
//
// We use one row, key = "drop_times". The cron writes; the GET route reads.
// If the table is missing or empty, callers fall back to DROP_TIMES_FALLBACK.

import { createSupabaseAdminClient } from "@/lib/supabase";
import { DROP_TIMES_FALLBACK, type DropTimesPayload } from "@/lib/studio/drop-times";

const TABLE = "studio_kv";
const KEY = "drop_times";

export async function readDropTimes(): Promise<DropTimesPayload> {
  try {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb
      .from(TABLE)
      .select("value, updated_at")
      .eq("key", KEY)
      .maybeSingle();

    if (error || !data?.value) {
      return DROP_TIMES_FALLBACK;
    }

    const value = data.value as DropTimesPayload;
    // Trust but verify a couple of shape requirements.
    if (!value.platforms?.length) return DROP_TIMES_FALLBACK;
    return {
      ...value,
      updatedAt: data.updated_at ?? value.updatedAt,
    };
  } catch {
    return DROP_TIMES_FALLBACK;
  }
}

export async function writeDropTimes(payload: DropTimesPayload): Promise<void> {
  const sb = createSupabaseAdminClient();
  const { error } = await sb
    .from(TABLE)
    .upsert(
      { key: KEY, value: payload, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );
  if (error) throw new Error(`Failed to write drop_times: ${error.message}`);
}
