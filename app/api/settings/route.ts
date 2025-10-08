// /app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("settings").doc("site").get();
    const data = snap.exists
      ? (snap.data() as any)
      : { closed: false, closedMessage: "" };

    return NextResponse.json({
      closed: !!data.closed,
      closedMessage: String(data.closedMessage || ""),
      updatedAt: data.updatedAt || null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { closed: false, closedMessage: "", error: e?.message || "Server error" },
      { status: 200 }
    );
  }
}
