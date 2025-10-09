"use client";

import { useEffect, useState } from "react";

type Settings = {
  closed?: boolean;
  message?: string;
};

export default function ClosedBanner() {
  const [loading, setLoading] = useState(true);
  const [closed, setClosed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // ❗️Client-side fetch de l’API publique
        const res = await fetch("/api/settings", { cache: "no-store" });
        const j: Settings = res.ok ? await res.json() : {};
        if (!mounted) return;
        setClosed(!!j.closed && !!j.message);
        setMessage(String(j.message || ""));
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

  if (loading || !closed) return null;

  return (
    <div className="closed-banner">
      <div className="closed-banner__inner">{message}</div>
    </div>
  );
}
