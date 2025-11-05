// /app/components/PromoBanner.tsx
"use client";
import { useEffect, useState } from "react";

type Settings = {
  promoActive?: boolean;
  promoText?: string;
  promoBanner?: { enabled?: boolean; message?: string };
};

export default function PromoBanner() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const j: Settings = res.ok ? await res.json() : {};
        if (!mounted) return;

        const enabled = typeof j.promoActive === "boolean" ? !!j.promoActive : !!j.promoBanner?.enabled;
        const message = (j.promoText ?? j.promoBanner?.message ?? "") as string;

        setActive(enabled && !!message.trim());
        setText(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading || !active) return null;

  return (
    <div className="colibri-banner" role="status" aria-live="polite">
      <span className="colibri-banner__chip" aria-hidden title="Promotion">%</span>
      <span className="colibri-banner__text">{text}</span>
    </div>
  );
}
