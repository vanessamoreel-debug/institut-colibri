// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const DOC_PATH = { col: "settings", id: "site" };

export async function GET() {
  const db = getAdminDb();
  const snap = await db.collection(DOC_PATH.col).doc(DOC_PATH.id).get();
  const data = snap.exists ? (snap.data() as any) : {};
  return NextResponse.json({
    closed: !!data.closed,
    message: data.message ?? "",
    updatedAt: data.updatedAt ?? null,
  });
}
