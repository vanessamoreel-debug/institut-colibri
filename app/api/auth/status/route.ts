// /app/api/auth/status/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookie = (req.headers.get("cookie") || "").split(/;\s*/).find(c => c.startsWith("colibri_admin="));
  const authed = cookie?.split("=")[1] === "1";
  return NextResponse.json({ authed });
}
