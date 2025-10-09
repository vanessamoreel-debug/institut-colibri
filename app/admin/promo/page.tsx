// /app/admin/promo/page.tsx
import { headers } from "next/headers";
import PromoEditor from "../../components/admin/PromoEditor";

export const dynamic = "force-dynamic";

async function getSettings() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/settings`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminPromo() {
  const s = (await getSettings()) ?? {};
  const initial = {
    promoActive: !!s?.promoActive,
    promoText: s?.promoText ?? ""
  };
  return <PromoEditor initial={initial} />;
}
