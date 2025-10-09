// /app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service, Category, PageDoc } from "../../types";
import MenuAdmin from "../components/MenuAdmin";

// Helper affichage durée (local au fichier)
function formatDurationInline(s: { duration?: number | null; approxDuration?: boolean | null }) {
  if (s.duration == null) return "—";
  const v = Math.round(Number(s.duration));
  return s.approxDuration ? `± ${v} min` : `${v} min`;
}


type Tab = "soins" | "contact" | "a-propos" | "fermeture" | "promo";
type PriceMode = "single" | "range";

/* ==== HELPERS HORS COMPOSANT (visibles partout) ==== */
function numOrNull(v: any): number | null {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatDuration(s: Service) {
  if (s.duration == null) return "—";
  const v = Math.round(s.duration);
  return s.approxDuration ? `± ${v} min` : `${v} min`;
}

function formatPriceAdmin(s: Service) {
  if (s.priceMin != null && s.priceMax != null) return `${s.priceMin}–${s.priceMax} CHF`;
  if (s.priceMin != null) return `${s.priceMin} CHF`;
  if (s.price != null) return `${s.price} CHF`;
  return "—";
}

/* =================================================== */

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("soins");

  // --- Promo ---
  const [promoActive, setPromoActive] = useState<boolean>(false);
  const [promoText, setPromoText] = useState<string>("");
  const [promoMsg, setPromoMsg] = useState<string>("");

  // --- Auth ---
  const [authed, setAuthed] = useState<boolean | null>(null);

  // --- Soins ---
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Service>>({});
  const [priceMode, setPriceMode] = useState<PriceMode>("single");
  const [msg, setMsg] = useState<string>("");

  // --- Catégories ---
  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catForm, setCatForm] = useState<Partial<Category>>({});
  const [catMsg, setCatMsg] = useState<string>("");

  // --- Pages ---
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);

  const [contactTitle, setContactTitle] = useState<string>("");
  const [contactBody, setContactBody] = useState<string>("");
  const [contactMsg, setContactMsg] = useState<string>("");

  const [aproposTitle, setAproposTitle] = useState<string>("");
  const [aproposBody, setAproposBody] = useState<string>("");
  const [aproposMsg, setAproposMsg] = useState<string>("");

  // --- Fermeture (bannière) ---
  const [closed, setClosed] = useState<boolean>(false);
  const [closedMessage, setClosedMessage] = useState<string>("");
  const [closedMsg, setClosedMsg] = useState<string>("");

  function handleUnauthorized(res: Response) {
    if (res.status === 401) {
      router.replace("/login?next=/admin");
      return true;
    }
    return false;
  }

  // --------- LOADERS ----------
  async function loadAuth() {
    try {
      const r = await fetch("/api/auth/status", {
        credentials: "include",
        cache: "no-store",
      });
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
      const res = await fetch("/api/admin/pages", {
        cache: "no-store",
        credentials: "include",
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const list: PageDoc[] = json.data || [];
      setPages(list);

      const contact = list.find((p) => p.slug === "contact");
      const apropos = list.find((p) => p.slug === "a-propos");

      setContactTitle(contact?.title || "Contact");
      setContactBody(contact?.body || "");
      setAproposTitle(apropos?.title || "À propos");
      setAproposBody(apropos?.body || "");
    } catch (e: any) {
      setContactMsg(e?.message || "Erreur de chargement des pages");
      setAproposMsg(e?.message || "Erreur de chargement des pages");
    } finally {
      setPagesLoading(false);
    }
  }

  // ⚙️ Unique source de vérité: /api/admin/settings
  async function loadSettings() {
    try {
      const res = await fetch("/api/admin/settings", {
        cache: "no-store",
        credentials: "include",
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      // Fermeture
      setClosed(!!json.closed);
      setClosedMessage(json.message || "");
      // Promo
      if ("promoActive" in json) setPromoActive(!!json.promoActive);
      if ("promoText" in json) setPromoText(String(json.promoText || ""));
    } catch (e: any) {
      setClosedMsg(e?.message || "Erreur de chargement des réglages");
    }
  }

  // 🟢 Enregistrer la promo via /api/admin/settings
  async function savePromo() {
    setPromoMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoActive,
          promoText,
          // compat éventuelle ancien schéma
          promoBanner: { enabled: promoActive, message: promoText },
        }),
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setPromoMsg("✔️ Promotion enregistrée.");
    } catch (e: any) {
      setPromoMsg(`❌ Erreur: ${e?.message || "action refusée"}`);
    }
  }

  useEffect(() => {
    loadAuth();
    loadServices();
    loadCats();
    loadPages();
    loadSettings();
  }, []);

  // --------- HELPERS PRIX (UI) ----------
  function inferPriceMode(s: Partial<Service>): PriceMode {
    if (s.priceMin != null && s.priceMax != null) return "range";
    return "single";
  }

  function onChangePriceMode(next: PriceMode) {
    setPriceMode(next);
    setForm((prev) => {
      const copy = { ...prev };
      if (next === "single") {
        const base = copy.priceMin ?? copy.price ?? null;
        copy.price = base;
        copy.priceMin = base;
        copy.priceMax = null;
      } else {
        const base = copy.price ?? copy.priceMin ?? null;
        copy.price = null;
        copy.priceMin = base;
      }
      return copy;
    });
  }

  // --------- CRUD SOINS ----------
  async function addOrUpdate() {
    setMsg("");
    if (!form?.name || !String(form.name).trim()) {
      setMsg("Nom requis.");
      return;
    }

    if (priceMode === "single") {
      const uniqueVal = numOrNull(form.price ?? form.priceMin);
      if (uniqueVal == null) return setMsg("Prix requis.");
    } else {
      const pmin = numOrNull(form.priceMin);
      const pmax = numOrNull(form.priceMax);
      if (pmin == null) return setMsg("Prix min requis.");
      if (pmax != null && pmax < pmin) return setMsg("Prix max doit être ≥ prix min.");
    }

    const payload = {
      ...form,
      price: null,
      priceMin:
        priceMode === "single"
          ? numOrNull(form.price ?? form.priceMin)
          : numOrNull(form.priceMin),
      priceMax: priceMode === "range" ? numOrNull(form.priceMax) : null,

      category: form.category ? String(form.category).toUpperCase() : null,
      duration: form.duration == null ? null : Number(form.duration),
      approxDuration: !!form.approxDuration,
      order: form.order == null ? null : Number(form.order),
      spacing: form.spacing == null ? null : Number(form.spacing),
      description: form.description ?? "",
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
      setPriceMode("single");
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

  function editService(s: Service) {
    setForm(s);
    setPriceMode(inferPriceMode(s));
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

  // --------- PAGES (Contact / A-propos) ----------
  async function savePage(
    slug: "contact" | "a-propos",
    title: string,
    body: string,
    setMsg: (v: string) => void
  ) {
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
      if (handleUnauthorized(res)) return;

      const text = await res.text();
      if (!res.ok) {
        try {
          const err = JSON.parse(text);
          throw new Error(err?.error || text);
        } catch {
          throw new Error(text);
        }
      }
      const json = JSON.parse(text);
      setPages(json.data || []);
      setMsg("✔️ Page enregistrée.");
    } catch (e: any) {
      setMsg(`❌ Erreur: ${e?.message || "action refusée"}`);
    }
  }

  // --------- SETTINGS (Fermeture) ----------
  async function saveSettings() {
    setClosedMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closed, message: closedMessage }),
      });
      if (handleUnauthorized(res)) return;
      if (!res.ok) throw new Error(await res.text());
      setClosedMsg("✔️ Réglages enregistrés.");
    } catch (e: any) {
      setClosedMsg(`❌ Erreur: ${e?.message || "action refusée"}`);
    }
  }

  // Tri local soins
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
      {/* Barre de statut + menu admin */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Administration</h2>
          <div style={{ fontSize: 13, color: authed ? "green" : "crimson" }}>
            Statut admin : {authed == null ? "…" : authed ? "OK" : "NON CONNECTÉ"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MenuAdmin tab={tab} setTab={setTab} />
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
              router.replace("/login");
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* =================== ONGLET SOINS =================== */}
      {tab === "soins" && (
        <>
          {/* Catégories */}
          <div className="admin-card">
            <h3 className="admin-section-title">Catégories (ordre des sections)</h3>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              MAJUSCULES, avec un numéro d'ordre (1 en haut, puis 2, 3...).
            </p>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 120px 180px" }}>
              <input
                placeholder="Nom de la catégorie (ex: SOINS DU VISAGE)"
                value={catForm.name || ""}
                onChange={(e) => setCatForm({ ...(catForm as any), name: e.target.value.toUpperCase() })}
              />
              <input
                placeholder="Ordre (ex: 1)"
                type="number"
                value={catForm.order?.toString() || ""}
                onChange={(e) => setCatForm({ ...(catForm as any), order: numOrNull(e.target.value) as any })}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={catAddOrUpdate}>{(catForm as any).id ? "Enregistrer" : "Ajouter"}</button>
                {(catForm as any).id ? <button onClick={() => setCatForm({})}>Annuler</button> : null}
              </div>
            </div>

            {catMsg ? <p style={{ color: catMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{catMsg}</p> : null}

            {catsLoading ? (
              <p>Chargement des catégories…</p>
            ) : (
              <table style={{ width: "100%", background: "#fff", border: "1px solid #eee", borderRadius: 10, marginTop: 12 }}>
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
                          <button onClick={() => catRemove(c.id)} style={{ marginLeft: 8 }}>
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
                <tbody>
  {dataSorted.map((s) => (
    <tr key={s.id}>
      <td>{s.name}</td>
      <td style={{ textAlign: "center" }}>{s.category || "—"}</td>

      {/* durée inline (plus d'appel à formatDuration) */}
      <td style={{ textAlign: "center" }}>
        {s.duration == null
          ? "—"
          : (s.approxDuration
              ? `± ${Math.round(s.duration)} min`
              : `${Math.round(s.duration)} min`)
        }
      </td>

      {/* corrige le " ? ?" en " ?? " */}
      <td style={{ textAlign: "center" }}>{s.order ?? "—"}</td>

      {/* prix inline (plus d'appel à formatPriceAdmin si tu veux rester self-contained ici) */}
      <td style={{ textAlign: "center", fontWeight: 600 }}>
        {s.priceMin != null && s.priceMax != null
          ? `${s.priceMin}–${s.priceMax} CHF`
          : (s.priceMin != null
              ? `${s.priceMin} CHF`
              : (s.price != null ? `${s.price} CHF` : "—"))}
      </td>

      <td style={{ textAlign: "center" }}>
        <button onClick={() => editService(s)}>Modifier</button>
        <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>
          Supprimer
        </button>
      </td>
    </tr>
  ))}
  {dataSorted.length === 0 ? (
    <tr>
      <td colSpan={6} style={{ color: "#666", padding: 8 }}>
        Aucun soin.
      </td>
    </tr>
  ) : null}
</tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* =================== ONGLET CONTACT =================== */}
      {tab === "contact" && (
        <div className="admin-card">
          <h3 className="admin-section-title">Page Contact</h3>
          <p className="admin-muted" style={{ marginTop: 0 }}>
            Cette page est publique sur <code>/contact</code>.
          </p>

          <div className="admin-grid-2">
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>Titre</label>
              <input value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} placeholder="Contact" />

              <label style={{ display: "block", fontWeight: 600, margin: "12px 0 4px" }}>Contenu</label>
              <textarea
                value={contactBody}
                onChange={(e) => setContactBody(e.target.value)}
                placeholder="Adresse, téléphone, e-mail, horaires…"
                style={{ width: "100%", height: 220 }}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={() => savePage("contact", contactTitle, contactBody, setContactMsg)}>Enregistrer</button>
                <button onClick={loadPages}>Recharger</button>
              </div>

              {contactMsg ? (
                <p style={{ color: contactMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{contactMsg}</p>
              ) : null}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Aperçu</div>
              <div className="admin-card" style={{ minHeight: 220 }}>
                <h2 style={{ marginTop: 0 }}>{contactTitle || "Contact"}</h2>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{contactBody || "—"}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================== ONGLET A PROPOS =================== */}
      {tab === "a-propos" && (
        <div className="admin-card">
          <h3 className="admin-section-title">Page À propos</h3>
          <p className="admin-muted" style={{ marginTop: 0 }}>
            Cette page est publique sur <code>/a-propos</code>.
          </p>

          <div className="admin-grid-2">
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>Titre</label>
              <input value={aproposTitle} onChange={(e) => setAproposTitle(e.target.value)} placeholder="À propos" />

              <label style={{ display: "block", fontWeight: 600, margin: "12px 0 4px" }}>Contenu</label>
              <textarea
                value={aproposBody}
                onChange={(e) => setAproposBody(e.target.value)}
                placeholder="Votre histoire, votre philosophie, l’équipe…"
                style={{ width: "100%", height: 220 }}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={() => savePage("a-propos", aproposTitle, aproposBody, setAproposMsg)}>Enregistrer</button>
                <button onClick={loadPages}>Recharger</button>
              </div>

              {aproposMsg ? (
                <p style={{ color: aproposMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{aproposMsg}</p>
              ) : null}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Aperçu</div>
              <div className="admin-card" style={{ minHeight: 220 }}>
                <h2 style={{ marginTop: 0 }}>{aproposTitle || "À propos"}</h2>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{aproposBody || "—"}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================== ONGLET FERMETURE =================== */}
      {tab === "fermeture" && (
        <div className="admin-card">
          <h3 className="admin-section-title">Bannière de fermeture (congés / indisponibilité)</h3>
          <p className="admin-muted" style={{ marginTop: 0 }}>
            Active une bannière visible en haut des pages publiques (Accueil, Soins, Contact, À&nbsp;propos).
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={closed} onChange={(e) => setClosed(e.target.checked)} />
            Afficher la bannière de fermeture
          </label>

          <div style={{ marginTop: 12 }}>
            <textarea
              placeholder="Message (ex : L’institut est fermé du 5 au 20 août inclus — merci pour votre compréhension.)"
              value={closedMessage}
              onChange={(e) => setClosedMessage(e.target.value)}
              style={{ width: "100%", height: 120 }}
            />
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button onClick={saveSettings}>Enregistrer</button>
            <button onClick={loadSettings}>Recharger</button>
          </div>

          {closedMsg ? (
            <p style={{ color: closedMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{closedMsg}</p>
          ) : null}
        </div>
      )}

      {/* =================== ONGLET PROMO =================== */}
      {tab === "promo" && (
        <div className="admin-card">
          <h3 className="admin-section-title">Bannière promotion</h3>
          <p className="admin-muted" style={{ marginTop: 0 }}>
            Message promo affiché tout en haut des pages publiques si activé.
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={promoActive}
              onChange={(e) => setPromoActive(e.target.checked)}
            />
            Afficher la bannière promo
          </label>

          <div style={{ marginTop: 10 }}>
            <textarea
              placeholder="Ex : -20% sur les soins visage jusqu’au 31/08"
              value={promoText}
              onChange={(e) => setPromoText(e.target.value)}
              style={{ width: "100%", height: 100 }}
            />
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button onClick={savePromo}>Enregistrer</button>
            <button onClick={loadSettings}>Recharger</button>
          </div>

          {promoMsg ? (
            <p style={{ color: promoMsg.startsWith("✔") ? "green" : "crimson", marginTop: 8 }}>{promoMsg}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
