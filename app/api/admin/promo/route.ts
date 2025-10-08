// /app/api/admin/promo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = getAdminDb() as ReturnType<typeof getFirestore>;
    const doc = await db.collection("settings").doc("promo").get();
    if (!doc.exists) return NextResponse.json({ active: false, text: "" });
    return NextResponse.json({ active: !!doc.get("active"), text: String(doc.get("text") || "") });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = getAdminDb() as ReturnType<typeof getFirestore>;
    const payload = await req.json().catch(() => ({}));
    const active = !!payload.active;
    const text = String(payload.text || "");

    await db.collection("settings").doc("promo").set(
      { active, text, updatedAt: Date.now() },
      { merge: true }
    );

    const doc = await db.collection("settings").doc("promo").get();
    return NextResponse.json({ ok: true, active: !!doc.get("active"), text: String(doc.get("text") || "") });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
