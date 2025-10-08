// /app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// Même logique d’authentification que tes autres routes admin
function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

// GET: lire les réglages actuels (fermeture + promo)
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const db = getAdminDb();
    const snap = await db.collection("settings").doc("general").get();
    const data = snap.exists ? (snap.data() as any) : {};

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

// PUT: enregistrer les réglages (tu peux envoyer un, plusieurs, ou tous les champs)
export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));

    // On lit l’existant pour préserver les champs non envoyés
    const db = getAdminDb();
    const ref = db.collection("settings").doc("general");
    const snap = await ref.get();
    const current = snap.exists ? (snap.data() as any) : {};

    const next = {
      closed: body.closed ?? current.closed ?? false,
      message: body.message ?? current.message ?? "",
      promoActive: body.promoActive ?? current.promoActive ?? false,
      promoText: body.promoText ?? current.promoText ?? "",
    };

    await ref.set(next, { merge: true });

    return NextResponse.json(next);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
