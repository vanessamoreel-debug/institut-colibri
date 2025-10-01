// /app/api/pages/route.ts
import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

function initAdmin() {
  if (getApps().length) return;
  const projectId = process.env.FB_PROJECT_ID!;
  const clientEmail = process.env.FB_CLIENT_EMAIL!;
  const privateKey = (process.env.FB_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

// GET /api/pages
// GET /api/pages?slug=contact
export async function GET(req: Request) {
  try {
    initAdmin();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const db = getFirestore();

    // Un seul document par slug
    if (slug) {
      const snap = await db.collection("pages").doc(slug).get();
      if (!snap.exists) {
        return NextResponse.json(null, { status: 200 });
      }
      const data = snap.data() || {};
      return NextResponse.json({
        id: snap.id,
        slug: snap.id,
        title: data.title || "",
        body: data.body || "",
        updatedAt: data.updatedAt || null,
      });
    }

    // Liste de toutes les pages
    const qs = await db.collection("pages").get();
    const out = qs.docs.map(d => ({
      id: d.id,
      slug: d.id,
      title: d.get("title") || "",
      body: d.get("body") || "",
      updatedAt: d.get("updatedAt") || null,
    }));
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

