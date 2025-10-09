// /app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

// GET (admin): lire les réglages privés
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = getAdminDb();
    const snap = await db.collection("settings").doc("general").get();
    const data = snap.exists ? (snap.data() as any) : {};

    return NextResponse.json({
      closed: !!data.closed,
      message: data.message || "",
      promoActive: !!data.promoActive,
      promoText: data.promoText || "",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// PUT (admin): enregistrer fermeture + promo
export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const db = getAdminDb();
    const ref = db.collection("settings").doc("general");
    const snap = await ref.get();
    const current = snap.exists ? (snap.data() as any) : {};

    const next = {
      // fermeture
      closed: body.closed ?? current.closed ?? false,
      message: body.message ?? current.message ?? "",
      // promo (nouveau schéma direct)
      promoActive: body.promoActive ?? current.promoActive ?? false,
      promoText: body.promoText ?? current.promoText ?? "",
      // compat ancien schéma (si tu veux garder les anciens champs)
      promoBanner: {
        enabled:
          body?.promoBanner?.enabled ??
          body?.promoActive ??
          current?.promoBanner?.enabled ??
          current?.promoActive ??
          false,
        message:
          body?.promoBanner?.message ??
          body?.promoText ??
          current?.promoBanner?.message ??
          current?.promoText ??
          "",
      },
    };

    await ref.set(next, { merge: true });
    return NextResponse.json(next);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
