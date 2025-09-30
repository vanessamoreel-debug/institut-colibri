// /app/api/categories/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("categories").orderBy("name").get();
    const out = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return new NextResponse(e?.message || "Error", { status: 500 });
  }
}
