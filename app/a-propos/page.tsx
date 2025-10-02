// /app/a-propos/page.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getPage(slug: string) {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/pages?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function AProposPage() {
  const data = await getPage("a-propos");
  const title = data?.title || "À propos";
  const body = data?.body || "Votre histoire, votre philosophie, l’équipe…";

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{body}</pre>
    </div>
  );
}
