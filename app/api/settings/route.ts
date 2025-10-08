// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("settings").doc("general").get();
    const data = snap.exists ? (snap.data() as any) : {};

    // Valeurs par défaut si absentes
    const out = {
      closed: !!data.closed,
      message: data.message || "",
      promoActive: !!data.promoActive,
      promoText: data.promoText || "",
    };

    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
