"use client";
import { useEffect, useState } from "react";
import { Service } from "../../types";

export default function AdminPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Service>>({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services", { cache: "no-store" });
    setData(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addOrUpdate() {
    const method = form?.id ? "PUT" : "POST";
    await fetch("/api/admin/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({});
    await load();
  }

  async function remove(id: string) {
    await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <div>
      <h2>Administration des soins</h2>
      <p>Cette page est protégée (mot de passe). Ici, vous pouvez ajouter, modifier, supprimer.</p>

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
