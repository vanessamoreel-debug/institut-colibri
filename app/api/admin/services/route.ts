import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, price, duration, category, description } = body || {};
  if (!name || typeof price !== "number") return new NextResponse("Invalid body", { status: 400 });
  const db = getAdminDb();
  const doc = await db.collection("services").add({
    name, price, duration: duration ?? null, category: category ?? null, description: description ?? null
  });
  return NextResponse.json({ id: doc.id });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const db = getAdminDb();
  await db.collection("services").doc(id).update(rest);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const db = getAdminDb();
  await db.collection("services").doc(id).delete();
  return NextResponse.json({ ok: true });
}
