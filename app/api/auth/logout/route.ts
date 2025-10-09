// /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = new NextResponse(JSON.stringify({ ok: true }), { status: 200 });
  // On « supprime » le cookie en le faisant expirer
  res.headers.set(
    "Set-Cookie",
    [
      `colibri_admin=`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Secure`,
      `Max-Age=0`,
    ].join("; ")
  );
  res.headers.set("Content-Type", "application/json");
  return res;
}
