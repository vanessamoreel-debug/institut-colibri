// /app/api/admin/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

async function listAll() {
  const db = getAdminDb();
  const snap = await db.collection("services").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));

  const {
    name,
    price,         // compat ancien champ (facultatif)
    priceMin,
    priceMax,
    duration,
    approxDuration,
    category,
    description,
    order,
    spacing,
  } = body || {};

  if (typeof name !== "string" || !name.trim()) {
    return new NextResponse("Nom requis", { status: 400 });
  }

  // Prix: on accepte soit priceMin (obligatoire minimum), soit price unique.
  const p  = price  == null || price  === "" ? null : Number(price);
  const pmin = priceMin == null || priceMin === "" ? null : Number(priceMin);
  const pmax = priceMax == null || priceMax === "" ? null : Number(priceMax);

  // Validation simple
  if (pmin == null && p == null) {
    return new NextResponse("Prix requis (prix min ou prix unique).", { status: 400 });
  }
  if ((pmin != null && !Number.isFinite(pmin)) || (pmax != null && !Number.isFinite(pmax)) || (p != null && !Number.isFinite(p))) {
    return new NextResponse("Prix invalide.", { status: 400 });
  }
  if (pmin != null && pmax != null && pmax < pmin) {
    return new NextResponse("Prix max doit être ≥ prix min.", { status: 400 });
  }

  const dur = duration == null || duration === "" ? null : Number(duration);
  if (dur !== null && !Number.isFinite(dur)) {
    return new NextResponse("Durée invalide", { status: 400 });
  }

  const cat = typeof category === "string" && category.trim() ? category.trim().toUpperCase() : null;
  const ord = order == null || order === "" ? null : Number(order);
  const sp  = spacing == null || spacing === "" ? null : Number(spacing);

  const db = getAdminDb();
  await db.collection("services").add({
    name: name.trim(),
    // Stockage: si intervalle fourni, on met priceMin/priceMax; sinon price unique.
    price: pmin == null && p != null ? p : null,
    priceMin: pmin != null ? pmin : (p != null ? p : null),
    priceMax: pmax != null ? pmax : null,

    duration: dur,
    approxDuration: !!approxDuration,
    category: cat,
    description: description ?? null,
    order: ord,
    spacing: sp,
  });

  const data = await listAll();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { id, ...rest } = body || {};
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const patch: any = { ...rest };

  // Prix
  if ("price" in patch) {
    const p = patch.price == null || patch.price === "" ? null : Number(patch.price);
    if (p != null && !Number.isFinite(p)) return new NextResponse("Prix invalide", { status: 400 });
    patch.price = p;
  }
  if ("priceMin" in patch) {
    const pmin = patch.priceMin == null || patch.priceMin === "" ? null : Number(patch.priceMin);
    if (pmin != null && !Number.isFinite(pmin)) return new NextResponse("Prix min invalide", { status: 400 });
    patch.priceMin = pmin;
  }
  if ("priceMax" in patch) {
    const pmax = patch.priceMax == null || patch.priceMax === "" ? null : Number(patch.priceMax);
    if (pmax != null && !Number.isFinite(pmax)) return new NextResponse("Prix max invalide", { status: 400 });
    patch.priceMax = pmax;
  }
  if (("priceMin" in patch) || ("priceMax" in patch) || ("price" in patch)) {
    // Cohérence simple: si on a un intervalle, on annule price unique.
    if (patch.priceMin != null || patch.priceMax != null) {
      patch.price = null;
      if (patch.priceMin != null && patch.priceMax != null && patch.priceMax < patch.priceMin) {
        return new NextResponse("Prix max doit être ≥ prix min.", { status: 400 });
      }
    } else if (patch.price != null) {
      // prix unique → recopier en min si min non fourni
      if (!("priceMin" in patch) || patch.priceMin == null) {
        patch.priceMin = patch.price;
      }
    }
  }

  // Autres champs
  if ("duration" in patch) {
    const dur = patch.duration == null || patch.duration === "" ? null : Number(patch.duration);
    if (dur !== null && !Number.isFinite(dur)) {
      return new NextResponse("Durée invalide", { status: 400 });
    }
    patch.duration = dur;
  }

  if ("approxDuration" in patch) {
    patch.approxDuration = !!patch.approxDuration;
  }

  if ("category" in patch) {
    const c = patch.category;
    patch.category = (typeof c === "string" && c.trim()) ? c.trim().toUpperCase() : null;
  }

  if ("order" in patch) {
    patch.order = patch.order == null || patch.order === "" ? null : Number(patch.order);
  }

  if ("spacing" in patch) {
    patch.spacing = patch.spacing == null || patch.spacing === "" ? null : Number(patch.spacing);
  }

  const db = getAdminDb();
  await db.collection("services").doc(id).update(patch);

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
