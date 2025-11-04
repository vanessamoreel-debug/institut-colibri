// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAdminDb();

    // On lit le document unique "settings/general"
    const snap = await db.collection("settings").doc("general").get();
    const data: any = snap.exists ? snap.data() : {};

    // Normalisation (nouveau schéma)
    const closed =
      typeof data?.closed === "boolean"
        ? data.closed
        : !!data?.closedBanner?.enabled;
    const message =
      typeof data?.message === "string"
        ? data.message
        : String(data?.closedBanner?.message || "");

    const promoActive =
      typeof data?.promoActive === "boolean"
        ? data.promoActive
        : !!data?.promoBanner?.enabled;

    const promoText =
      typeof data?.promoText === "string"
        ? data.promoText
        : String(data?.promoBanner?.message || "");

    const payload = { closed, message, promoActive, promoText };

    const res = NextResponse.json(payload);
    // très important: désactiver tout cache
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}
