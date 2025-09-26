// /app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // on stocke ici la cible vers laquelle rediriger après login
  const [nextPath, setNextPath] = useState<string>("/admin");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  // On lit le paramètre ?next=… sans useSearchParams (pour éviter l’erreur build)
  useEffect(() => {
    if (typeof window !== "object") return;
    const url = new URL(window.location.href);
    const n = url.searchParams.get("next");
    if (n) setNextPath(n);
    const el = document.getElementById("user");
    if (el) (el as HTMLInputElement).focus();
  }, []);

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
      router.replace(nextPath || "/admin");
    } catch (err: any) {
      setMsg(err?.message || "Identifiants invalides");
    }
  }

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
