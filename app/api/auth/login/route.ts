// /app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json().catch(() => ({}));
    const expected = process.env.ADMIN_CODE || "";
    if (!expected) {
      return new NextResponse("ADMIN_CODE non configuré.", { status: 500 });
    }
    if (String(code) !== String(expected)) {
      return new NextResponse("Code invalide.", { status: 401 });
    }

    // ✅ Cookie admin
    const res = NextResponse.json({ ok: true });
    res.cookies.set("colibri_admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 6, // 6h
    });
    return res;
  } catch (e: any) {
    return new NextResponse(e?.message || "Erreur serveur", { status: 500 });
  }
}
