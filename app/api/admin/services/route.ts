// /app/api/admin/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  // On s'assure que le cookie de session existe
  return req.cookies.get("colibri_admin")?.value === "1";
}

async function listAll() {
  const db = getAdminDb();
  const snap = await db.collection("services").orderBy("category").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { name, price, duration, category, description } = body || {};

  if (typeof name !== "string" || !name.trim()) {
    return new NextResponse("Nom requis", { status: 400 });
  }
  const p = Number(price);
  if (!Number.isFinite(p)) {
    return new NextResponse("Prix invalide", { status: 400 });
  }

  const db = getAdminDb();
  await db.collection("services").add({
    name: name.trim(),
    price: p,
    duration: duration ?? null,
    category: category ?? null,
    description: description ?? null,
  });

  const data = await listAll();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id, ...rest } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });

  if ("price" in rest) {
    const p = Number(rest.price);
    if (!Number.isFinite(p)) {
      return new NextResponse("Prix invalide", { status: 400 });
    }
    (rest as any).price = p;
  }

  const db = getAdminDb();
  await db.collection("services").doc(id).update(rest);

  const data = await listAll();
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const db = getAdminDb();
  await db.collection("services").doc(id).delete();

  const data = await listAll();
  return NextResponse.json({ ok: true, data });
}
