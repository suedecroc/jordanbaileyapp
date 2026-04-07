import { cookies } from "next/headers";

export const STUDIO_COOKIE = "studio_key";

export async function isStudioAuthed(): Promise<boolean> {
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(STUDIO_COOKIE)?.value === expected;
}
