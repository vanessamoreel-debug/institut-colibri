// /app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Service, Category } from "../../types";

export default function AdminPage() {
  const router = useRouter();

  // --- Soins ---
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Service>>({});
  const [msg, setMsg] = useState<string>("");

  // --- Catégories ---
  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catForm, setCatForm] = useState<Partial<Category>>({});
  const [catMsg, setCatMsg] = useState<string>("");

  // Charger soins
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

  // Charger catégories
  async function loadCats() {
    setCatsLoading(true);
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      setCats(await res.json());
    } catch (e: any) {
      setCatMsg(e?.message || "Erreur de chargement des catégories");
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

  // --------- CRUD SOINS ----------
  async function addOrUpdate() {
    setMsg("");
    if (!form?.name || !Number.isFinite(Number(form?.price))) {
      setMsg("Nom et prix (nombre) sont obligatoires.");
      return;
    }

    // ✅ durée: null si vide/absente, sinon nombre
    const durationValue =
      form.duration == null ? null : Number(form.duration);

    const payload = {
      ...form,
      category: form.category ? String(form.category).toUpperCase() : null,
      price: Number(form.price),
      duration: durationValue,
      approxDuration: !!form.approxDuration,
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

  // --------- CRUD CATEGORIES ----------
  async function catAddOrUpdate() {
    setCatMsg("");
    if (!catForm?.name || !String(catForm.name).trim()) {
      setCatMsg("Nom de catégorie requis.");
      return;
    }
    const payload = { id: (catForm as any).id, name: String(catForm.name).trim().toUpperCase() };
    const method = (catForm as any).id ? "PUT" : "POST";
    try {
      const res = await fetch("/api/admin/categories", {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setCats(json.data || []);
      setCatForm({});
      setCatMsg("✔️ Catégorie enregistrée.");
    } catch (e: any) {
      setCatMsg(`❌ Erreur: ${e?.message || "action refusée"} `);
    }
  }

  async function catRemove(id: string) {
    setCatMsg("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setCats(json.data || []);
      setCatMsg("✔️ Catégorie supprimée.");
    } catch (e: any) {
      setCatMsg(`❌ Erreur: ${e?.message || "action refusée"} `);
    }
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

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, margin: "12px 0" }}>
        <div />
        <button onClick={logout}>Se déconnecter</button>
      </div>

      {/* --- Bloc Catégories --- */}
      <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #eee", marginBottom: 20 }}>
        <h3>Catégories</h3>
        <p style={{ marginTop: 0, color: "#666" }}>Écrites et enregistrées en MAJUSCULES. Elles sont proposées en saisie des soins.</p>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 160px" }}>
          <input
            placeholder="Nom de la catégorie (ex: SOINS DU VISAGE)"
            value={catForm.name || ""}
            onChange={e => setCatForm({ ...(catForm as any), name: e.target.value.toUpperCase() })}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={catAddOrUpdate}>{(catForm as any).id ? "Enregistrer" : "Ajouter"}</button>
            {(catForm as any).id ? <button onClick={() => setCatForm({})}>Annuler</button> : null}
          </div>
        </div>

        {catMsg ? <p style={{ color: catMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{catMsg}</p> : null}

        {catsLoading ? <p>Chargement des catégories…</p> : (
          <table style={{ width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 10, marginTop: 12 }}>
            <thead>
              <tr><th style={{ textAlign: "left" }}>Nom</th><th style={{ width: 180 }}>Actions</th></tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => setCatForm(c)}>Modifier</button>
                    <button onClick={() => catRemove(c.id)} style={{ marginLeft: 8 }}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {cats.length === 0 ? <tr><td colSpan={2} style={{ color: "#666", padding: 8 }}>Aucune catégorie.</td></tr> : null}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Bloc Soins --- */}
      <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #eee", marginBottom: 20 }}>
        <h3>{form?.id ? "Modifier un soin" : "Ajouter un soin"}</h3>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 140px 140px 1fr" }}>
          <input placeholder="Nom" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Prix (CHF)" type="number" value={form.price?.toString() || ""} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <input placeholder="Durée (min)" type="number" value={form.duration?.toString() || ""} onChange={e => setForm({ ...form, duration: e.target.value === "" ? (undefined as any) : Number(e.target.value) })} />

          {/* Catégorie avec suggestions */}
          <input
            list="colibri-cats"
            placeholder="Catégorie (ex: SOINS DU VISAGE)"
            value={form.category || ""}
            onChange={e => setForm({ ...form, category: e.target.value.toUpperCase() })}
          />
          <datalist id="colibri-cats">
            {cats.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>

        {/* Case à cocher : durée approximative */}
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <input
            type="checkbox"
            checked={!!form.approxDuration}
            onChange={e => setForm({ ...form, approxDuration: e.target.checked })}
          />
          Durée approximative (afficher “±” devant la durée)
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
                <td style={{ textAlign: "center", fontWeight: 600 }}>{s.price} CHF</td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => setForm(s)}>Modifier</button>
                  <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>Supprimer</button>
                </td>
              </tr>
            ))}
            {data.length === 0 ? <tr><td colSpan={5} style={{ color: "#666", padding: 8 }}>Aucun soin.</td></tr> : null}
          </tbody>
        </table>
      )}
    </div>
  );
}
