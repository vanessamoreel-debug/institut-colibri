// /app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

async function listAllSorted() {
  const db = getAdminDb();
  const snap = await db.collection("categories").get();
  const out = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any[];
  out.sort((a, b) => {
    const oa = a.order ?? 9999;
    const ob = b.order ?? 9999;
    if (oa !== ob) return oa - ob;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  return out;
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  let { name, order } = body || {};
  if (typeof name !== "string" || !name.trim()) {
    return new NextResponse("Nom requis", { status: 400 });
  }
  name = name.trim().toUpperCase();
  const ord = order == null || order === "" ? null : Number(order);

  const db = getAdminDb();
  await db.collection("categories").add({ name, order: ord });

  const data = await listAllSorted();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  let { id, name, order } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const patch: any = {};
  if (typeof name === "string") {
    if (!name.trim()) return new NextResponse("Nom requis", { status: 400 });
    patch.name = name.trim().toUpperCase();
  }
  if ("order" in (body || {})) {
    patch.order = order == null || order === "" ? null : Number(order);
  }

  const db = getAdminDb();
  await db.collection("categories").doc(id).update(patch);

  const data = await listAllSorted();
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const db = getAdminDb();
  await db.collection("categories").doc(id).delete();

  const data = await listAllSorted();
  return NextResponse.json({ ok: true, data });
}
