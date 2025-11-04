// /app/components/Banners.tsx
import ClosedBanner from "./ClosedBanner";
import PromoBanner from "./PromoBanner";

export const dynamic = "force-dynamic";

// Serveur : peut rendre ClosedBanner (SSR) + PromoBanner (client)
export default function Banners() {
  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto 10px" }}>
      {/* Fermeture au-dessus (prioritaire), puis Promo */}
      {/* Chaque bannière gère déjà sa propre marge-top */}
      <ClosedBanner />
      <PromoBanner />
    </div>
  );
}
