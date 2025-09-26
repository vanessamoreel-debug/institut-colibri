// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isLogin = pathname === "/login";

  const session = req.cookies.get("colibri_admin")?.value === "1";

  // Si on va sur /login alors qu'on est déjà connecté → redirige /admin
  if (isLogin && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Si route protégée et pas connecté → redirige vers /login
  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
