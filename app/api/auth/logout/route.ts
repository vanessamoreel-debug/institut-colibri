// /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Efface le cookie
  res.cookies.set("colibri_admin", "", { path: "/", maxAge: 0 });
  return res;
}
