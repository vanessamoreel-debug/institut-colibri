// /app/components/PromoBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
});

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

        const enabled =
          typeof j.promoActive === "boolean"
            ? !!j.promoActive
            : !!j.promoBanner?.enabled;

        const message = (j.promoText ?? j.promoBanner?.message ?? "") as string;

        setActive(enabled && !!message.trim());
        setText(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !active) return null;

  return (
    <div
      className={inter.className}
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "8px auto 0",
        padding: "12px 20px",
        borderRadius: 14,
        border: "1px solid rgba(125,108,113,.25)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.45))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#7D6C71", // même couleur que le titre
        textAlign: "center",
        fontWeight: 500,
        fontVariantNumeric: "lining-nums proportional-nums",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: "1.05rem",
          lineHeight: 1.4,
        }}
      >
        <span
          aria-hidden
          title="Promotion"
          style={{
            display: "inline-flex",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#7D6C71", // pastille inchangée
            color: "#fff",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          %
        </span>
        <span style={{ fontWeight: 600 }}>{text}</span>
      </span>
    </div>
  );
}
