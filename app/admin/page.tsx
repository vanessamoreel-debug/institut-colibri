// /app/admin/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Service, Category, PageDoc } from "../../types";

type Tab = "soins" | "contact" | "a-propos";

// petit helper pour convertir un input en number | null
function numOrNull(v: any): number | null {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("soins");

  // --- Indic. Auth ---
  const [authed, setAuthed] = useState<boolean | null>(null);

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

  // --- Pages: Contact & À propos (séparées) ---
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);

  const [contactTitle, setContactTitle] = useState<string>("");
  const [contactBody, setContactBody] = useState<string>("");
  const [contactMsg, setContactMsg] = useState<string>("");

  const [aproposTitle, setAproposTitle] = useState<string>("");
  const [aproposBody, setAproposBody] = useState<string>("");
  const [aproposMsg, setAproposMsg] = useState<string>("");

  function handleUnauthorized(res: Response) {
    if (res.status === 401) {
      router.replace("/login?next=/admin");
      return true;
    }
    return false;
  }

  // --------- LOADERS ---------
  async function loadAuth() {
    try {
      const r = await fetch("/api/auth/status", { credentials: "include", cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      setAuthed(!!j?.authed);
      if (!j?.authed) router.replace("/login?next=/admin");
    } catch {
      setAuthed(null);
    }
  }

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

  async function loadPages() {
    setPagesLoading(true);
    try {
      const res = await fetch("/api/admin/pages", { cache: "no-store", credentials: "include" });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setPages(json.data || []);

      // Pré-remplir Contact et À-propos si existants
      const contact = (json.data || []).find((p: PageDoc) => p.slug === "contact");
      const apropos = (json.data || []).find((p: PageDoc) => p.slug === "a-propos");

      setContactTitle(contact?.title || "Contact");
      setContactBody(contact?.body || "");
      setAproposTitle(apropos?.title || "À propos");
      setAproposBody(apropos?.body || "");
    } catch (e: any) {
      // ne bloque pas l'UI, mais affiche le message au besoin
      setContactMsg(e?.message || "Erreur de chargement des pages");
      setAproposMsg(e?.message || "Erreur de chargement des pages");
    } finally {
      setPagesLoading(false);
    }
  }

  useEffect(() => {
    loadAuth();
    loadServices();
    loadCats();
    loadPages();
  }, []);

  // --------- CRUD SOINS ----------
  async function addOrUpdate() {
    setMsg("");

    if (!form?.name) return setMsg("Nom requis.");
    const minOk = form.priceMin == null || Number.isFinite(Number(form.priceMin));
    const maxOk = form.priceMax == null || Number.isFinite(Number(form.priceMax));
    if (!minOk || !maxOk) return setMsg("Prix incorrect.");

    const payload = {
      ...form,
      category: form.category ? String(form.category).toUpperCase() : null,
      price: form.price == null ? null : Number(form.price),
      priceMin: form.priceMin == null ? null : Number(form.priceMin),
      priceMax: form.priceMax == null ? null : Number(form.priceMax),
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

  // --------- CRUD PAGES (Contact / À-propos) ----------
  async function savePage(slug: "contact" | "a-propos", title: string, body: string, setMsg: (v: string) => void) {
    setMsg("");
    if (!title || !title.trim()) {
      setMsg("Titre requis.");
      return;
    }
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title: title.trim(), body: body ?? "" }),
      });

      // Logs utiles si souci
      console.log("DEBUG PUT /api/admin/pages status", res.status);
      if (handleUnauthorized(res)) return;

      const text = await res.text();
      console.log("DEBUG PUT /api/admin/pages raw", text);

      if (!res.ok) {
        try {
          const err = JSON.parse(text);
          throw new Error(err?.error || text);
        } catch {
          throw new Error(text);
        }
      }

      let json: any = null;
      try { json = JSON.parse(text); } catch { throw new Error("Réponse serveur invalide (JSON attendu)."); }

      setPages(json.data || []);
      setMsg("✔️ Page enregistrée.");
    } catch (e: any) {
      console.error("DEBUG PUT /api/admin/pages error", e);
      setMsg(`❌ Erreur: ${e?.message || "action refusée"}`);
    }
  }

  // --------- Tri local soins ----------
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

  // --------- UI ----------
  return (
    <div>
      <h2>Administration</h2>

      {/* statut auth + logout */}
      <div style={{ display: "flex", justifyContent: "space-between", margin: "12px 0" }}>
        <div style={{ fontSize: 13, color: authed ? "green" : "crimson" }}>
          Statut admin : {authed == null ? "…" : authed ? "OK" : "NON CONNECTÉ"}
        </div>
        <button onClick={logout}>Se déconnecter</button>
      </div>

      {/* Onglets */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab("soins")} style={{ fontWeight: tab === "soins" ? 700 : 400 }}>
          Soins
        </button>
        <button onClick={() => setTab("contact")} style={{ fontWeight: tab === "contact" ? 700 : 400 }}>
          Contact
        </button>
        <button onClick={() => setTab("a-propos")} style={{ fontWeight: tab === "a-propos" ? 700 : 400 }}>
          À propos
        </button>
      </div>

      {tab === "soins" && (
        <>
          {/* --- Bloc Catégories --- */}
          <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #eee", marginBottom: 20 }}>
            <h3>Catégories (ordre des sections)</h3>
            <p style={{ marginTop: 0, color: "#666" }}>MAJUSCULES, avec un numéro d'ordre (1 en haut, puis 2, 3...).</p>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 120px 180px" }}>
              <input
                placeholder="Nom de la catégorie (ex: SOINS DU VISAGE)"
                value={catForm.name || ""}
                onChange={e => setCatForm({ ...(catForm as any), name: e.target.value.toUpperCase() })}
              />
              <input
                placeholder="Ordre (ex: 1)"
                type="number"
                value={catForm.order?.toString() || ""}
                onChange={e => setCatForm({ ...(catForm as any), order: numOrNull(e.target.value) as any })}
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
                  <tr><th style={{ textAlign: "left" }}>Nom</th><th style={{ width: 120 }}>Ordre</th><th style={{ width: 180 }}>Actions</th></tr>
                </thead>
                <tbody>
                  {[...cats].sort((a, b) => {
                    const oa = a.order ?? 9999, ob = b.order ?? 9999;
                    if (oa !== ob) return oa - ob;
                    return (a.name || "").localeCompare(b.name || "");
                  }).map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td style={{ textAlign: "center" }}>{c.order ?? "—"}</td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => setCatForm(c)}>Modifier</button>
                        <button onClick={() => catRemove(c.id)} style={{ marginLeft: 8 }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {cats.length === 0 ? <tr><td colSpan={3} style={{ color: "#666", padding: 8 }}>Aucune catégorie.</td></tr> : null}
                </tbody>
              </table>
            )}
          </div>

          {/* --- Bloc Soins --- */}
          <div style={{ background: "#fff", padding: 14, borderRadius: 10, border: "1px solid #eee", marginBottom: 20 }}>
            <h3>{form?.id ? "Modifier un soin" : "Ajouter un soin"}</h3>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 110px 110px 90px 90px 1fr" }}>
              <input placeholder="Nom" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Prix (CHF)" type="number" value={form.price?.toString() || ""} onChange={e => setForm({ ...form, price: numOrNull(e.target.value) as any })} />
              <input placeholder="Prix max (facultatif)" type="number" value={form.priceMax?.toString() || ""} onChange={e => setForm({ ...form, priceMax: numOrNull(e.target.value) as any })} />
              <input placeholder="Durée (min)" type="number" value={form.duration?.toString() || ""} onChange={e => setForm({ ...form, duration: numOrNull(e.target.value) as any })} />
              <input placeholder="Ordre" type="number" value={form.order?.toString() || ""} onChange={e => setForm({ ...form, order: numOrNull(e.target.value) as any })} />
              <input list="colibri-cats" placeholder="Catégorie" value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value.toUpperCase() })} />
              <datalist id="colibri-cats">
                {cats.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>

            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <input type="checkbox" checked={!!form.approxDuration} onChange={e => setForm({ ...form, approxDuration: e.target.checked })} />
              Durée approximative (±)
            </label>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 110px" }}>
              <textarea placeholder="Description (optionnel)" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
              <input placeholder="Espacement (px)" type="number" value={form.spacing?.toString() || ""} onChange={e => setForm({ ...form, spacing: numOrNull(e.target.value) as any })} />
            </div>

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
                {dataSorted.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td style={{ textAlign: "center" }}>{s.category || "—"}</td>
                    <td style={{ textAlign: "center" }}>{formatDuration(s)}</td>
                    <td style={{ textAlign: "center" }}>{s.order ?? "—"}</td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>
  {s.priceMin != null && s.priceMax != null
    ? `${s.priceMin}–${s.priceMax} CHF`
    : s.priceMin != null
      ? `${s.priceMin} CHF`
      : s.price != null
        ? `${s.price} CHF`
        : "—"}
</td>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button onClick={() => setForm(s)}>Modifier</button>
                      <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>Supprimer</button>
                    </td>
                  </tr>
                ))}
                {dataSorted.length === 0 ? <tr><td colSpan={6} style={{ color: "#666", padding: 8 }}>Aucun soin.</td></tr> : null}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "contact" && (
        <div className="card" style={{ background: "#fff", border: "1px solid #eee" }}>
          <h3>Page Contact</h3>
          <p style={{ marginTop: 0, color: "#666" }}>Cette page est publique sur <code>/contact</code>.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>Titre</label>
              <input value={contactTitle} onChange={e => setContactTitle(e.target.value)} placeholder="Contact" />

              <label style={{ display: "block", fontWeight: 600, margin: "12px 0 4px" }}>Contenu</label>
              <textarea
                value={contactBody}
                onChange={e => setContactBody(e.target.value)}
                placeholder="Adresse, téléphone, e-mail, horaires…"
                style={{ width: "100%", height: 220 }}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={() => savePage("contact", contactTitle, contactBody, setContactMsg)}>Enregistrer</button>
                <button onClick={loadPages}>Recharger</button>
              </div>

              {contactMsg ? <p style={{ color: contactMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{contactMsg}</p> : null}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Aperçu</div>
              <div className="card" style={{ minHeight: 220 }}>
                <h2 style={{ marginTop: 0 }}>{contactTitle || "Contact"}</h2>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{contactBody || "—"}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "a-propos" && (
        <div className="card" style={{ background: "#fff", border: "1px solid #eee" }}>
          <h3>Page À propos</h3>
          <p style={{ marginTop: 0, color: "#666" }}>Cette page est publique sur <code>/a-propos</code>.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>Titre</label>
              <input value={aproposTitle} onChange={e => setAproposTitle(e.target.value)} placeholder="À propos" />

              <label style={{ display: "block", fontWeight: 600, margin: "12px 0 4px" }}>Contenu</label>
              <textarea
                value={aproposBody}
                onChange={e => setAproposBody(e.target.value)}
                placeholder="Votre histoire, votre philosophie, l’équipe…"
                style={{ width: "100%", height: 220 }}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={() => savePage("a-propos", aproposTitle, aproposBody, setAproposMsg)}>Enregistrer</button>
                <button onClick={loadPages}>Recharger</button>
              </div>

              {aproposMsg ? <p style={{ color: aproposMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{aproposMsg}</p> : null}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Aperçu</div>
              <div className="card" style={{ minHeight: 220 }}>
                <h2 style={{ marginTop: 0 }}>{aproposTitle || "À propos"}</h2>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{aproposBody || "—"}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
