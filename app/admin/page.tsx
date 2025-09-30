// /app/admin/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
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
      const json = (await res.json()) as Service[];
      setData(json);
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
      const json = (await res.json()) as Category[];
      setCats(json);
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

  // Tri local (catégorie -> ordre soin -> nom)
  const dataSorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const ca = String(a.category || "");
      const cb = String(b.category || "");
      const ia = cats.find((c) => c.name === ca)?.order ?? 9999;
      const ib = cats.find((c) => c.name === cb)?.order ?? 9999;
      if (ia !== ib) return ia - ib;
      const oa = a.order ?? 9999;
      const ob = b.order ?? 9999;
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
    return copy;
  }, [data, cats]);

  // --------- CRUD SOINS ----------
  async function addOrUpdate() {
    setMsg("");

    // Validation prix: au moins priceMin, et cohérence avec priceMax
    const minOk = Number.isFinite(Number(form.priceMin));
    const maxOk = form.priceMax == null || Number.isFinite(Number(form.priceMax));

    if (!form?.name) {
      setMsg("Nom requis.");
      return;
    }
    if (!minOk) {
      setMsg("Prix min requis (ou prix unique).");
      return;
    }
    if (!maxOk) {
      setMsg("Prix max invalide.");
      return;
    }
    if (
      form.priceMin != null &&
      form.priceMax != null &&
      Number(form.priceMax) < Number(form.priceMin)
    ) {
      setMsg("Prix max doit être ≥ prix min.");
      return;
    }

    const payload: any = {
      ...form,
      // On stocke en min/max (price unique non utilisé dans l’UI)
      price: null,
      priceMin: form.priceMin == null ? null : Number(form.priceMin),
      priceMax: form.priceMax == null ? null : Number(form.priceMax),

      category: form.category ? String(form.category).toUpperCase() : null,
      duration: form.duration == null ? null : Number(form.duration),
      approxDuration: !!form.approxDuration,
      order: form.order == null ? null : Number(form.order),
      spacing: form.spacing == null ? null : Number(form.spacing),
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

  // --------- CRUD CATEGORIES ----------
  async function catAddOrUpdate() {
    setCatMsg("");
    if (!catForm?.name || !String(catForm.name).trim()) {
      setCatMsg("Nom de catégorie requis.");
      return;
    }
    const payload = {
      id: (catForm as any).id,
      name: String(catForm.name).trim().toUpperCase(),
      order: catForm.order == null ? null : Number(catForm.order),
    };
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

  return (
    <div>
      <h2>Administration des soins</h2>
      <p>Ajoutez, modifiez ou supprimez vos prestations.</p>

      <div style={{ display: "flex", justifyContent: "flex-end", margin: "12px 0" }}>
        <button onClick={logout}>Se déconnecter</button>
      </div>

      {/* --- Bloc Catégories --- */}
      <div
        style={{
          background: "#fff",
          padding: 14,
          borderRadius: 10,
          border: "1px solid #eee",
          marginBottom: 20,
        }}
      >
        <h3>Catégories (ordre des sections)</h3>
        <p style={{ marginTop: 0, color: "#666" }}>
          MAJUSCULES, avec un numéro d&apos;ordre (1 en haut, puis 2, 3...).
        </p>

        <div
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr 120px 180px",
          }}
        >
          <input
            placeholder="Nom de la catégorie (ex: SOINS DU VISAGE)"
            value={catForm.name || ""}
            onChange={(e) =>
              setCatForm({ ...(catForm as any), name: e.target.value.toUpperCase() })
            }
          />
          <input
            placeholder="Ordre (ex: 1)"
            type="number"
            value={catForm.order?.toString() || ""}
            onChange={(e) =>
              setCatForm({
                ...(catForm as any),
                order: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={catAddOrUpdate}>
              {(catForm as any).id ? "Enregistrer" : "Ajouter"}
            </button>
            {(catForm as any).id ? (
              <button onClick={() => setCatForm({})}>Annuler</button>
            ) : null}
          </div>
        </div>

        {catMsg ? (
          <p
            style={{
              color: catMsg.startsWith("✔") ? "green" : "crimson",
              marginTop: 8,
            }}
          >
            {catMsg}
          </p>
        ) : null}

        {catsLoading ? (
          <p>Chargement des catégories…</p>
        ) : (
          <table
            style={{
              width: "100%",
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 10,
              marginTop: 12,
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Nom</th>
                <th style={{ width: 120 }}>Ordre</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...cats]
                .sort((a, b) => {
                  const oa = a.order ?? 9999,
                    ob = b.order ?? 9999;
                  if (oa !== ob) return oa - ob;
                  return (a.name || "").localeCompare(b.name || "");
                })
                .map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td style={{ textAlign: "center" }}>{c.order ?? "—"}</td>
                    <td style={{ textAlign: "center" }}>
                      <button onClick={() => setCatForm(c)}>Modifier</button>
                      <button
                        onClick={() => catRemove(c.id)}
                        style={{ marginLeft: 8 }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              {cats.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ color: "#666", padding: 8 }}>
                    Aucune catégorie.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Bloc Soins --- */}
      <div
        style={{
          background: "#fff",
          padding: 14,
          borderRadius: 10,
          border: "1px solid #eee",
          marginBottom: 20,
        }}
      >
        <h3>{form?.id ? "Modifier un soin" : "Ajouter un soin"}</h3>

        {/* Prix min / Prix max + autres champs */}
        <div
          style={{
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr 90px 90px 90px 90px 1fr",
          }}
        >
          <input
            placeholder="Nom"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Prix min"
            type="number"
            value={form.priceMin?.toString() || ""}
            onChange={(e) =>
              setForm({
                ...form,
                priceMin: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          <input
            placeholder="Prix max (optionnel)"
            type="number"
            value={form.priceMax?.toString() || ""}
            onChange={(e) =>
              setForm({
                ...form,
                priceMax: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          <input
            placeholder="Durée (min)"
            type="number"
            value={form.duration?.toString() || ""}
            onChange={(e) =>
              setForm({
                ...form,
                duration: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          <input
            placeholder="Ordre"
            type="number"
            value={form.order?.toString() || ""}
            onChange={(e) =>
              setForm({
                ...form,
                order: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          <input
            list="colibri-cats"
            placeholder="Catégorie"
            value={form.category || ""}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value.toUpperCase() })
            }
          />
          <datalist id="colibri-cats">
            {cats.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </div>

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "120px 1fr" }}>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
            }}
          >
            <input
              type="checkbox"
              checked={!!form.approxDuration}
              onChange={(e) =>
                setForm({ ...form, approxDuration: e.target.checked })
              }
            />
            Durée approximative (±)
          </label>
          <input
            placeholder="Espace (px)"
            type="number"
            value={form.spacing?.toString() || ""}
            onChange={(e) =>
              setForm({
                ...form,
                spacing: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </div>

        <textarea
          placeholder="Description (optionnel)"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: "100%", marginTop: 8 }}
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={addOrUpdate}>
            {form?.id ? "Enregistrer" : "Ajouter"}
          </button>
          {form?.id ? <button onClick={() => setForm({})}>Annuler</button> : null}
        </div>
      </div>

      {msg ? (
        <p style={{ color: msg.startsWith("✔") ? "green" : "crimson" }}>{msg}</p>
      ) : null}

      {/* Tableau trié instantanément */}
      <div
        style={{
          width: "100%",
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 10,
        }}
      >
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Nom</th>
              <th>Catégorie</th>
              <th>Durée</th>
              <th>Ordre</th>
              <th>Espace</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSorted.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td style={{ textAlign: "center" }}>{s.category || "—"}</td>
                <td style={{ textAlign: "center" }}>{formatDuration(s)}</td>
                <td style={{ textAlign: "center" }}>{s.order ?? "—"}</td>
                <td style={{ textAlign: "center" }}>{s.spacing ?? "—"}</td>
                <td style={{ textAlign: "center", fontWeight: 600 }}>
                  {s.priceMin != null && s.priceMax != null
                    ? `${s.priceMin}–${s.priceMax} CHF`
                    : s.priceMin != null
                    ? `${s.priceMin} CHF`
                    : s.price != null
                    ? `${s.price} CHF`
                    : "—"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => setForm(s)}>Modifier</button>
                  <button
                    onClick={() => remove(s.id)}
                    style={{ marginLeft: 8 }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {dataSorted.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ color: "#666", padding: 8 }}>
                  Aucun soin.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
