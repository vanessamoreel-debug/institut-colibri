"use client";
import { useEffect, useState } from "react";
import { Service } from "../../types";

// Encodage Basic Auth "user:pass" -> "Basic base64(...)"
function basicAuthHeader(user: string, pass: string) {
  if (!user || !pass) return {};
  const token = typeof window !== "undefined" ? btoa(`${user}:${pass}`) : "";
  return { Authorization: `Basic ${token}` };
}

export default function AdminPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Service>>({});
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/services", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
    } catch (e: any) {
      setMsg(e?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addOrUpdate() {
    setMsg("");
    if (!form?.name || typeof form?.price !== "number") {
      setMsg("Nom et prix sont obligatoires.");
      return;
    }
    const method = form?.id ? "PUT" : "POST";
    try {
      const res = await fetch("/api/admin/services", {
        method,
        headers: {
          "Content-Type": "application/json",
          ...basicAuthHeader(user, pass),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setForm({});
      await load();
      setMsg("✔️ Sauvegardé.");
    } catch (e: any) {
      setMsg(`❌ Erreur: ${e?.message || "action refusée (auth ?)"} `);
    }
  }

  async function remove(id: string) {
    setMsg("");
    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...basicAuthHeader(user, pass),
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
      setMsg("✔️ Supprimé.");
    } catch (e: any) {
      setMsg(`❌ Erreur: ${e?.message || "action refusée (auth ?)"} `);
    }
  }

  return (
    <div>
      <h2>Administration des soins</h2>
      <p>Cette page est protégée (mot de passe). Ici, vous pouvez ajouter, modifier, supprimer.</p>

      {/* Bloc identifiants pour les requêtes API */}
      <div style={{ background: "#fff", padding: 12, border: "1px solid #eee", borderRadius: 10, margin: "12px 0" }}>
        <strong>Identifiants API (les mêmes que l’accès à la page)</strong>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          <input placeholder="Identifiant (ADMIN_USER)" value={user} onChange={e => setUser(e.target.value)} />
          <input placeholder="Mot de passe (ADMIN_PASS)" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <small style={{ color: "#666" }}>Astuce : ils ne sont pas envoyés au serveur tant que vous ne cliquez pas sur un bouton (Ajouter/Enregistrer/Supprimer). Ils servent uniquement à créer l’en-tête d’authentification des requêtes.</small>
      </div>

      {/* Formulaire d'édition */}
      <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #eee", marginBottom: 20 }}>
        <h3>{form?.id ? "Modifier un soin" : "Ajouter un soin"}</h3>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 140px 140px 1fr" }}>
          <input placeholder="Nom" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Prix (CHF)" type="number" value={form.price?.toString() || ""} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <input placeholder="Durée (min)" type="number" value={form.duration?.toString() || ""} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
          <input placeholder="Catégorie (Visage, Corps, Épilation, ...)" value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value })} />
        </div>
        <textarea placeholder="Description (optionnel)" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: "100%", marginTop: 8 }} />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={addOrUpdate}>{form?.id ? "Enregistrer" : "Ajouter"}</button>
          {form?.id ? <button onClick={() => setForm({})}>Annuler</button> : null}
        </div>
      </div>

      {msg ? <p style={{ color: msg.startsWith("✔") ? "green" : "crimson" }}>{msg}</p> : null}

      {loading ? <p>Chargement…</p> : (
        <table style={{ width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 10 }}>
          <thead>
            <tr><th style={{ textAlign: "left" }}>Nom</th><th>Catégorie</th><th>Durée</th><th>Prix</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td style={{ textAlign: "center" }}>{s.category || "—"}</td>
                <td style={{ textAlign: "center" }}>{s.duration ?? "—"}</td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>{s.price} CHF</td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => setForm(s)}>Modifier</button>
                  <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
