// /app/api/promo/route.ts
import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/firebaseAdmin";

initAdmin();
const db = getFirestore();

export async function GET() {
  try {
    const doc = await db.collection("settings").doc("promo").get();
    if (!doc.exists) return NextResponse.json({ active: false });
    return NextResponse.json(doc.data());
  } catch (e) {
    console.error("Erreur Firestore promo:", e);
    return NextResponse.json({ active: false });
  }
}
