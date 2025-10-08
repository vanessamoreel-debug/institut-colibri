// /app/components/PromoBanner.tsx
"use client";

import { useEffect, useState } from "react";

type Settings = {
  promoActive?: boolean;
  promoText?: string;
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
        setActive(!!j.promoActive && !!j.promoText);
        setText(String(j.promoText || ""));
      } catch {
        // ignore
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
      style={{
        margin: "12px 0 14px",
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid rgba(125,108,113,.25)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.35))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#3d2f34",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
      className="info-panel"
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#7D6C71",
          color: "#fff",
          fontWeight: 700,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
        title="Promotion"
      >
        %
      </span>
      <span style={{ fontWeight: 600 }}>{text}</span>
    </div>
  );
}
