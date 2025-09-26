// /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { user, pass } = body || {};

  const ok =
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS &&
    !!user &&
    !!pass;

  if (!ok) return new NextResponse("Identifiants invalides", { status: 401 });

  const res = NextResponse.json({ ok: true });
  // Cookie de session: 7 jours
  res.cookies.set("colibri_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
