// Generic KV backed by the existing studio_kv Supabase table.
// Used by pipeline / buyers / history to sync across devices.
// Last-write-wins. Fire-and-forget from the client.

import { createSupabaseAdminClient } from "@/lib/supabase";

const TABLE = "studio_kv";

// Namespace all sync keys so they don't collide with drop_times etc.
const NS = "sync:";

export type SyncKey = "pipeline" | "buyers" | "history";

export async function readKV<T>(key: SyncKey): Promise<T | null> {
  try {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb
      .from(TABLE)
      .select("value")
      .eq("key", NS + key)
      .maybeSingle();
    if (error || !data?.value) return null;
    return data.value as T;
  } catch {
    return null;
  }
}

export async function writeKV<T>(key: SyncKey, value: T): Promise<void> {
  try {
    const sb = createSupabaseAdminClient();
    await sb.from(TABLE).upsert(
      { key: NS + key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );
  } catch {
    // Silently fail — localStorage is the source of truth on the client.
  }
}
