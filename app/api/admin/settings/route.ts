// /app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

const DOC_PATH = { col: "settings", id: "site" };

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const db = getAdminDb();
  const snap = await db.collection(DOC_PATH.col).doc(DOC_PATH.id).get();
  const data = snap.exists ? (snap.data() as any) : {};
  return NextResponse.json({
    closed: !!data.closed,
    message: data.message ?? "",
    updatedAt: data.updatedAt ?? null,
  });
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const closed = !!body.closed;
  const message = typeof body.message === "string" ? body.message : "";

  const db = getAdminDb();
  await db.collection(DOC_PATH.col).doc(DOC_PATH.id).set(
    {
      closed,
      message,
      updatedAt: Date.now(),
    },
    { merge: true }
  );

  return NextResponse.json({ ok: true, closed, message });
}
