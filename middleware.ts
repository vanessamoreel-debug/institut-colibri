import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const protectedPaths = path.startsWith("/admin") || path.startsWith("/api/admin");

  if (!protectedPaths) return NextResponse.next();

  const auth = req.headers.get("authorization") || "";
  const [type, encoded] = auth.split(" ");
  if (type !== "Basic" || !encoded) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' }
    });
  }
  const [u, p] = atob(encoded).split(":");
  if (u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS) {
    return NextResponse.next();
  }
  return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' } });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
