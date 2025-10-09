// /app/admin/promo/page.tsx
import PromoEditor from "../../components/admin/PromoEditor"; // chemin relatif vers app/components/admin/PromoEditor

async function getSettings() {
  const res = await fetch("/api/settings", { cache: "no-store" });
  return res.ok ? res.json() : null;
}

export default async function AdminPromo() {
  const s = (await getSettings()) ?? {};
  const initial = {
    promoActive: !!s.promoActive,
    promoText: s.promoText ?? ""
  };

  return <PromoEditor initial={initial} />;
}
