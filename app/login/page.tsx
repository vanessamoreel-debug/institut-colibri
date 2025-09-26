// /app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.replace(next);
    } catch (err: any) {
      setMsg(err?.message || "Identifiants invalides");
    }
  }

  // Si on revient déconnecté d'une page protégée, focus auto sur champ user
  useEffect(() => {
    const el = document.getElementById("user");
    if (el) (el as HTMLInputElement).focus();
  }, []);

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #eee" }}>
      <h2>Connexion administrateur</h2>
      <p style={{ color: "#666" }}>Entrez vos identifiants admin pour gérer les soins.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 10 }}>
        <input id="user" placeholder="Identifiant (ADMIN_USER)" value={user} onChange={e => setUser(e.target.value)} />
        <input placeholder="Mot de passe (ADMIN_PASS)" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
      {msg ? <p style={{ color: "crimson", marginTop: 10 }}>{msg}</p> : null}
    </div>
  );
}
