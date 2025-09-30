// /app/api/services/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";
import { Service } from "../../../types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("services").orderBy("category").get();
    const out: Service[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return new NextResponse(e?.message || "Error", { status: 500 });
  }
}
