import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { STUDIO_COOKIE } from "@/lib/studio/auth";

export async function POST(request: NextRequest) {
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) {
    return Response.json(
      { ok: false, error: "Studio password not configured on server." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || body.password !== expected) {
    return Response.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set({
    name: STUDIO_COOKIE,
    value: expected,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(STUDIO_COOKIE);
  return Response.json({ ok: true });
}
