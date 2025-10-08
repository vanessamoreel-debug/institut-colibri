// /app/a-propos/page.tsx
import { headers } from "next/headers";
import ClosedBanner from "../components/ClosedBanner";

export const dynamic = "force-dynamic"; // toujours dynamique

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
    <>
      {/* ✅ Bannière de fermeture (affichée seulement si activée dans l’admin) */}
      <ClosedBanner />

      <div className="pricelist info-panel">
        <h2 className="page-title">{title}</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            margin: 0,
            color: "#2b2326",
            lineHeight: 1.6,
          }}
        >
          {body}
        </pre>
      </div>
    </>
  );
}
