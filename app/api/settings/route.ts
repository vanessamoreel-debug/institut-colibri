// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getAdminDb();

  // 👉 On lit le document "general" (même cible que /api/admin/settings)
  const snap = await db.collection("settings").doc("general").get();
  const data: any = snap.exists ? snap.data() : {};

  // Compat : si anciens champs promoBanner.* existent, on les utilise par défaut
  const bannerEnabled = !!data?.promoBanner?.enabled;
  const bannerMessage = data?.promoBanner?.message ?? "";

  const promoActive =
    typeof data?.promoActive === "boolean" ? data.promoActive : bannerEnabled;

  const promoText =
    typeof data?.promoText === "string" ? data.promoText : bannerMessage;

  // On renvoie aussi les champs pour la bannière de fermeture si tu les utilises côté client
  return NextResponse.json({
    ...data,
    promoActive,
    promoText,
  });
}
