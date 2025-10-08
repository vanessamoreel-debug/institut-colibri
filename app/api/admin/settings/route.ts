// /app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

// GET (admin) : lire les réglages
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
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
}

// PUT (admin) : enregistrer { closed: boolean, closedMessage: string }
export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const db = getAdminDb();

  const body = await req.json().catch(() => ({}));
  const closed = !!body.closed;
  const closedMessage = String(body.closedMessage || "");

  await db.collection("settings").doc("site").set(
    {
      closed,
      closedMessage,
      updatedAt: Date.now(),
    },
    { merge: true }
  );

  return NextResponse.json({ ok: true, closed, closedMessage });
}
