// /app/components/PromoBanner.tsx
"use client";

import { useEffect, useState } from "react";

export default function PromoBanner() {
  const [promo, setPromo] = useState<{ active: boolean; text: string } | null>(null);

  useEffect(() => {
    // 🔥 Récupère l’état de la promo depuis Firestore (même logique que ClosedBanner)
    const fetchPromo = async () => {
      try {
        const res = await fetch("/api/promo");
        if (res.ok) {
          const data = await res.json();
          setPromo(data);
        }
      } catch (e) {
        console.error("Erreur promo:", e);
      }
    };
    fetchPromo();
  }, []);

  if (!promo?.active) return null;

  return (
    <div className="promo-banner">
      <span className="sparkle">✨</span>
      <span className="promo-text">{promo.text}</span>
      <span className="sparkle">✨</span>
    </div>
  );
}
