// /app/contact/page.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // rend la page toujours dynamique (pas de SSG)

async function getPage(slug: string) {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(
    `${base}/api/pages?slug=${encodeURIComponent(slug)}`,
    { cache: "no-store" } // pas de cache pour cette requête
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function ContactPage() {
  const data = await getPage("contact");
  const title = data?.title || "Contact";
  const body = data?.body || "Adresse, téléphone, e-mail, horaires…";

  return (
    <div className="pricelist" style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
        {body}
      </pre>
    </div>
  );
}
