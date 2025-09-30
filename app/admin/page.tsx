// /app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Service, Category } from "../../types";

export default function AdminPage() {
  const router = useRouter();

  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Service>>({});
  const [msg, setMsg] = useState<string>("");

  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  async function loadServices() {
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

  async function loadCats() {
    setCatsLoading(true);
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      setCats(await res.json());
    } catch {
      // pas critique
    } finally {
      setCatsLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
    loadCats();
  }, []);

  function handleUnauthorized(res: Response) {
    if (res.status === 401) {
      router.replace("/login?next=/admin");
      return true;
    }
    return false;
  }

  async function addOrUpdate() {
    setMsg("");
    if (!form?.name || !Number.isFinite(Number(form?.price))) {
      setMsg("Nom et prix (nombre) sont obligatoires.");
      return;
    }

    const payload = {
      ...form,
      category: form.category ? String(form.category).toUpperCase() : null,
      price: Number(form.price),
      duration: form.duration == null ? null : Number(form.duration),
      approxDuration: !!form.approxDuration,
      order: form.order == null ? null : Number(form.order),
    };

    const method = form?.id ? "PUT" : "POST";
    try {
      const res = await fetch("/api/admin/services", {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setData(json.data || []);
      setForm({});
      setMsg("✔️ Sauvegardé.");
      await loadCats();
    } catch (e: any) {
      setMsg(`❌ Erreur: ${e?.message || "action refusée"} `);
    }
  }

  async function remove(id: string) {
    setMsg("");
    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setData(json.data || []);
      setMsg("✔️ Supprimé.");
    } catch (e: any) {
      setMsg(`❌ Erreur: ${e?.message || "action refusée"} `);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
  }

  function formatDuration(s: Service) {
    if (s.duration == null) return "—";
    const v = Math.round(s.duration);
    return s.approxDuration ? `± ${v} min` : `${v} min`;
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

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 100px 100px 80px 1fr" }}>
          <input placeholder="Nom" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Prix (CHF)" type="number" value={form.price?.toString() || ""} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <input placeholder="Durée (min)" type="number" value={form.duration?.toString() || ""} onChange={e => setForm({ ...form, duration: e.target.value === "" ? null : Number(e.target.value) })} />
          <input placeholder="Ordre" type="number" value={form.order?.toString() || ""} onChange={e => setForm({ ...form, order: e.target.value === "" ? null : Number(e.target.value) })} />
          <input list="colibri-cats" placeholder="Catégorie" value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value.toUpperCase() })} />
          <datalist id="colibri-cats">
            {cats.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <input type="checkbox" checked={!!form.approxDuration} onChange={e => setForm({ ...form, approxDuration: e.target.checked })} />
          Durée approximative (±)
        </label>

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
              <th>Ordre</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td style={{ textAlign: "center" }}>{s.category || "—"}</td>
                <td style={{ textAlign: "center" }}>{formatDuration(s)}</td>
                <td style={{ textAlign: "center" }}>{s.order ?? "—"}</td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>{s.price} CHF</td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => setForm(s)}>Modifier</button>
                  <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>Supprimer</button>
                </td>
              </tr>
            ))}
            {data.length === 0 ? <tr><td colSpan={6} style={{ color: "#666", padding: 8 }}>Aucun soin.</td></tr> : null}
          </tbody>
        </table>
      )}
    </div>
  );
}
