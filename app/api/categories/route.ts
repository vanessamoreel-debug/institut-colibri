// /app/api/categories/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("categories").get();
    const out = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any[];
    // tri côté API: order puis name
    out.sort((a, b) => {
      const oa = a.order ?? 9999;
      const ob = b.order ?? 9999;
      if (oa !== ob) return oa - ob;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return new NextResponse(e?.message || "Error", { status: 500 });
  }
}
