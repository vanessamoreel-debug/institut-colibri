// /app/api/admin/pages/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

function initAdmin() {
  if (getApps().length) return;
  const projectId = process.env.FB_PROJECT_ID!;
  const clientEmail = process.env.FB_CLIENT_EMAIL!;
  const privateKey = (process.env.FB_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

function authed(req: NextRequest) {
  const c = req.cookies;
  const val =
    c.get("colibri")?.value ||
    c.get("colibri_auth")?.value ||
    c.get("colibriAuthed")?.value ||
    "";
  return val === "1" || val === "true";
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    initAdmin();
    const db = getFirestore();
    const qs = await db.collection("pages").get();
    const out = qs.docs.map(d => ({
      id: d.id,
      slug: d.id,
      title: d.get("title") || "",
      body: d.get("body") || "",
      updatedAt: d.get("updatedAt") || null,
    }));
    return NextResponse.json({ data: out });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// create/update : body { slug, title, body }
export async function PUT(req: NextRequest) {
  if (!authed(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    initAdmin();
    const db = getFirestore();
    const payload = await req.json();
    const slug = String(payload.slug || "").trim();
    const title = String(payload.title || "").trim();
    const body = String(payload.body || "");

    if (!slug) return new NextResponse("slug requis", { status: 400 });
    if (!title) return new NextResponse("title requis", { status: 400 });

    await db.collection("pages").doc(slug).set(
      {
        title,
        body,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    // renvoyer la liste à jour
    const qs = await db.collection("pages").get();
    const out = qs.docs.map(d => ({
      id: d.id,
      slug: d.id,
      title: d.get("title") || "",
      body: d.get("body") || "",
      updatedAt: d.get("updatedAt") || null,
    }));
    return NextResponse.json({ ok: true, data: out });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// delete : body { slug }
export async function DELETE(req: NextRequest) {
  if (!authed(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    initAdmin();
    const db = getFirestore();
    const payload = await req.json();
    const slug = String(payload.slug || "").trim();
    if (!slug) return new NextResponse("slug requis", { status: 400 });

    await db.collection("pages").doc(slug).delete();

    const qs = await db.collection("pages").get();
    const out = qs.docs.map(d => ({
      id: d.id,
      slug: d.id,
      title: d.get("title") || "",
      body: d.get("body") || "",
      updatedAt: d.get("updatedAt") || null,
    }));
    return NextResponse.json({ ok: true, data: out });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
