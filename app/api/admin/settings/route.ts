// /app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// Remplace par ta vraie vérif d'auth si nécessaire
function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

// GET (admin): lecture des réglages pour l'UI Admin
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const db = getAdminDb();
    const snap = await db.collection("settings").doc("general").get();
    const data: any = snap.exists ? snap.data() : {};

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

    return NextResponse.json({
      closed,
      message,
      promoActive,
      promoText,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

// PUT (admin): écriture fermeture + promo (compat ancien/nouveau schéma)
export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const db = getAdminDb();
    const ref = db.collection("settings").doc("general");
    const snap = await ref.get();
    const current: any = snap.exists ? snap.data() : {};

    // Normalisation des champs en entrée (compat)
    const nextClosed =
      typeof body.closed === "boolean"
        ? body.closed
        : typeof current.closed === "boolean"
        ? current.closed
        : !!current?.closedBanner?.enabled;

    const nextMessage =
      typeof body.message === "string"
        ? body.message
        : typeof current.message === "string"
        ? current.message
        : String(current?.closedBanner?.message || "");

    const computedPromoActive =
      typeof body.promoActive === "boolean"
        ? body.promoActive
        : typeof body?.promoBanner?.enabled === "boolean"
        ? body?.promoBanner?.enabled
        : typeof current.promoActive === "boolean"
        ? current.promoActive
        : !!current?.promoBanner?.enabled;

    const computedPromoText =
      typeof body.promoText === "string"
        ? body.promoText
        : typeof body?.promoBanner?.message === "string"
        ? body?.promoBanner?.message
        : typeof current.promoText === "string"
        ? current.promoText
        : String(current?.promoBanner?.message || "");

    // On écrit le nouveau schéma ET on garde l'ancien pour compat
    const nextDoc = {
      closed: nextClosed,
      message: nextMessage,
      promoActive: computedPromoActive,
      promoText: computedPromoText,
      // Compat anciens lecteurs :
      closedBanner: {
        enabled: nextClosed,
        message: nextMessage,
      },
      promoBanner: {
        enabled: computedPromoActive,
        message: computedPromoText,
      },
      updatedAt: new Date(),
    };

    await ref.set(nextDoc, { merge: true });

    // Réponse normalisée pour l'admin
    return NextResponse.json({
      closed: nextDoc.closed,
      message: nextDoc.message,
      promoActive: nextDoc.promoActive,
      promoText: nextDoc.promoText,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
