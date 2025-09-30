"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Service } from "../../types";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Service>>({});
  const [msg, setMsg] = useState<string>("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/services", {
        cache: "no-store",
        credentials: "include", // ← assure l'envoi des cookies
      });
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

  // Petite aide pour détecter une redirection vers /login depuis l'API
  function detectRedirectToLogin(res: Response) {
    // si le middleware a redirigé, fetch a suivi et on se retrouve avec du HTML de /login
    const redirected = res.url.includes("/login");
    if (redirected) router.replace("/login?next=/admin");
    return redirected;
  }

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
        credentials: "include", // ← IMPORTANT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (detectRedirectToLogin(res)) return;
      if (!res.ok) throw new Error(await res.text());
      setForm({});
      await load();
      setMsg("✔️ Sauvegardé.");
    } catch (e: any) {
      setMsg(`❌ Erreur: ${e?.message || "action refusée"} `);
    }
  }

  async function remove(id: string) {
    setMsg("");
    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        credentials: "include", // ← IMPORTANT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (detectRedirectToLogin(res)) return;
      if (!res.ok) throw new Error(await res.text());
      await load();
      setMsg("✔️ Supprimé.");
    } catch (e: any) {
      setMsg(`❌ Erreur: ${e?.message || "action refusée"} `);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
  }

  return (
    <div>
      <h2>Administration des soins</h2>
      <p>Ajoutez, modifiez ou supprimez vos prestations.</p>

      <div style={{ display: "flex", justifyContent: "flex-end", margin: "12px 0" }}>
        <button onClick={logout}>Se déconnecter</button>
      </div>

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
            <tr>
              <th style={{ textAlign: "left" }}>Nom</th>
              <th>Catégorie</th>
              <th>Durée</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
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
