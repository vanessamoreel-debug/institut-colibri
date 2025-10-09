// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// Lit d'abord settings/global, sinon settings/general (compat)
async function readSettings() {
  const refGlobal = adminDb.collection("settings").doc("global");
  const snapGlobal = await refGlobal.get();
  if (snapGlobal.exists) {
    return { data: (snapGlobal.data() as any) ?? {} };
  }

  const refGeneral = adminDb.collection("settings").doc("general");
  const snapGeneral = await refGeneral.get();
  if (snapGeneral.exists) {
    return { data: (snapGeneral.data() as any) ?? {} };
  }

  return { data: {} as any };
}

export async function GET() {
  const { data } = await readSettings();

  // Compat descendante promo : déduire promoActive/promoText depuis promoBanner si manquants
  const bannerEnabled = !!data?.promoBanner?.enabled;
  const bannerMessage = data?.promoBanner?.message ?? "";

  const promoActive =
    typeof data?.promoActive === "boolean" ? data.promoActive : bannerEnabled;

  const promoText =
    typeof data?.promoText === "string" ? data.promoText : bannerMessage;

  // Compat fermeture : closed/message depuis closedBanner si présents
  const closed =
    typeof data?.closed === "boolean"
      ? data.closed
      : !!data?.closedBanner?.enabled;

  const message =
    typeof data?.message === "string"
      ? data.message
      : String(data?.closedBanner?.message ?? "");

  // Réponse publique normalisée + objets compat
  return NextResponse.json({
    // champs simples attendus par tes composants client
    promoActive,
    promoText,
    closed,
    message,

    // on expose aussi les objets complets pour compat/évolutions
    promoBanner: {
      enabled: promoActive,
      message: promoText
    },
    closedBanner: {
      enabled: closed,
      message
    },

    // on laisse le reste des données inchangé si besoin par d'autres parties du site
    ...data
  });
}
