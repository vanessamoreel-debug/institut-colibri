// /middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi  = pathname.startsWith("/api/admin");
  const isLogin     = pathname === "/login";

  const authed = req.cookies.get("colibri_admin")?.value === "1";

  // Déjà connecté → /login => /admin
  if (isLogin && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Protection admin (pages + API)
  if ((isAdminPage || isAdminApi) && !authed) {
    // Pour les API, mieux vaut répondre 401 JSON qu'une redirection HTML
    if (isAdminApi) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Pour les pages, redirection vers /login en conservant le chemin + la query
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    const next = pathname + (search || "");
    url.search = `?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
