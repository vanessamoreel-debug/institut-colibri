"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.replace(next);
    } catch (e: any) {
      setMsg(e?.message || "Connexion refusée.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="info-panel" style={{ maxWidth: 420, margin: "30px auto" }}>
      <h2 className="page-title" style={{ textAlign: "center" }}>Connexion</h2>
      <p style={{ color: "#555", marginTop: 0, textAlign: "center" }}>
        Accès réservé à l’administration.
      </p>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input
          type="password"
          placeholder="Code d’accès"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
        {msg ? <p style={{ color: "crimson", margin: 0 }}>{msg}</p> : null}
      </form>
      <p style={{ marginTop: 10, fontSize: 12, color: "#666", textAlign: "center" }}>
        Cette page n’est pas indexée par les moteurs de recherche.
      </p>
    </div>
  );
}
