// /app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json().catch(() => ({}));
    const expected = process.env.ADMIN_PASSWORD || "MoLu0814";

    if (!password || password !== expected) {
      return new NextResponse("Identifiants invalides", { status: 401 });
    }

    // Crée le cookie de session admin
    const res = new NextResponse(JSON.stringify({ ok: true }), { status: 200 });
    res.headers.set(
      "Set-Cookie",
      [
        `colibri_admin=1`,
        `Path=/`,
        `HttpOnly`,
        `SameSite=Lax`,
        `Secure`, // laisse si tu es en https (Vercel l’est)
        `Max-Age=${60 * 60 * 8}`, // 8h
      ].join("; ")
    );
    res.headers.set("Content-Type", "application/json");
    return res;
  } catch (e) {
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
