// Sérvit un petit favicon SVG pour /favicon.ico (supprime ce fichier si tu ajoutes un vrai favicon.ico dans /public)
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <rect width="32" height="32" rx="6" ry="6" fill="#ffffff" />
  <rect x="1" y="1" width="30" height="30" rx="6" ry="6" fill="#f3eef0" stroke="#7D6C71" stroke-width="1"/>
  <text x="50%" y="57%" text-anchor="middle" dominant-baseline="middle"
        font-family="Playfair Display, serif" font-size="16" fill="#7D6C71">C</text>
</svg>`;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
