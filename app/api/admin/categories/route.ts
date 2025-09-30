// /app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

async function listAll() {
  const db = getAdminDb();
  const snap = await db.collection("categories").orderBy("name").get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  let { name } = body || {};
  if (typeof name !== "string" || !name.trim()) {
    return new NextResponse("Nom requis", { status: 400 });
  }
  name = name.trim().toUpperCase();

  const db = getAdminDb();
  await db.collection("categories").add({ name });

  const data = await listAll();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  let { id, name } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });
  if (typeof name !== "string" || !name.trim()) {
    return new NextResponse("Nom requis", { status: 400 });
  }
  name = name.trim().toUpperCase();

  const db = getAdminDb();
  await db.collection("categories").doc(id).update({ name });

  const data = await listAll();
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const db = getAdminDb();
  await db.collection("categories").doc(id).delete();

  const data = await listAll();
  return NextResponse.json({ ok: true, data });
}
