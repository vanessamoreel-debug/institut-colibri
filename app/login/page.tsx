"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Identifiants invalides");
      }
      // redirige vers la page demandée ou /admin
      router.replace(next);
    } catch (err: any) {
      setMsg(err?.message || "Erreur de connexion");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }} className="pricelist info-panel">
      <h2 className="page-title" style={{ marginTop: 0 }}>Connexion administrateur</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ fontWeight: 600 }}>
          Mot de passe
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%", marginTop: 6 }}
          />
        </label>
        <button type="submit" style={{ alignSelf: "start" }}>Se connecter</button>
        {msg ? <p style={{ color: msg.startsWith("Identifiants") ? "crimson" : "crimson", margin: 0 }}>{msg}</p> : null}
        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>
          Vous serez redirigé vers&nbsp;<code>{next}</code>.
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Chargement…</div>}>
      <LoginInner />
    </Suspense>
  );
}
