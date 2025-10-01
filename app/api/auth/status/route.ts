// /app/api/auth/status/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const authed = cookies().get("colibri_admin")?.value === "1";
  return NextResponse.json({ authed });
}
