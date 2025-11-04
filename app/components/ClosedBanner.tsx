// /app/components/ClosedBanner.tsx
"use client";

import { useEffect, useState } from "react";

export default function ClosedBanner() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const j = res.ok ? await res.json() : {};
        if (!mounted) return;

        const enabled = !!j?.closed;
        const message = String(j?.message ?? "").trim();
        setActive(enabled && !!message);
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
    <div className="colibri-banner" role="status" aria-live="polite">
      <span className="colibri-banner__chip" aria-hidden title="Fermeture">!</span>
      <span className="colibri-banner__text">{text}</span>
    </div>
  );
}
