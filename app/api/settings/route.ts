// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin"; // chemin relatif depuis /app/api/settings/route.ts

export async function GET() {
  const doc = await adminDb.collection("settings").doc("global").get();

  if (!doc.exists) {
    // Valeurs par défaut (compat avec PromoBanner et bannières)
    return NextResponse.json({
      promoActive: false,
      promoText: "",
      closedBanner: { enabled: false, message: "" },
      promoBanner: { enabled: false, message: "" }
    });
  }

  const data: any = { id: doc.id, ...doc.data() };

  // Compat descendante : dériver promoActive/promoText depuis promoBanner si nécessaire
  const bannerEnabled = !!data?.promoBanner?.enabled;
  const bannerMessage = data?.promoBanner?.message ?? "";

  const promoActive =
    typeof data?.promoActive === "boolean" ? data.promoActive : bannerEnabled;

  const promoText =
    typeof data?.promoText === "string" ? data.promoText : bannerMessage;

  return NextResponse.json({
    ...data,
    promoActive,
    promoText
  });
}
