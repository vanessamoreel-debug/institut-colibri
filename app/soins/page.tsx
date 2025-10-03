// /app/soins/page.tsx
import { headers } from "next/headers";
import { Category, Service } from "../../types";

async function getServices(): Promise<Service[]> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/services`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getCategories(): Promise<Category[]> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

function formatDuration(s: Service) {
  if (s.duration == null) return null;
  const v = Math.round(s.duration);
  return s.approxDuration ? `± ${v} min` : `${v} min`;
}

function formatPrice(s: Service) {
  if (s.priceMin != null && s.priceMax != null) return `${s.priceMin}–${s.priceMax} CHF`;
  if (s.priceMin != null) return `${s.priceMin} CHF`;
  if (s.price != null) return `${s.price} CHF`;
  return "—";
}

export default async function SoinsPage() {
  const [services, categories] = await Promise.all([getServices(), getCategories()]);

  // Regrouper par catégorie
  const byCat = services.reduce<Record<string, Service[]>>((acc, s) => {
    const k = s.category || "AUTRES";
    (acc[k] ||= []).push(s);
    return acc;
  }, {});
  const presentCats = Object.keys(byCat);

  // Ordre des catégories
  const knownOrder = categories
    .filter(c => presentCats.includes(c.name))
    .sort((a, b) => {
      const oa = a.order ?? 9999;
      const ob = b.order ?? 9999;
      if (oa !== ob) return oa - ob;
      return (a.name || "").localeCompare(b.name || "");
    })
    .map(c => c.name);

  const unknown = presentCats
    .filter(name => !knownOrder.includes(name))
    .sort((a, b) => a.localeCompare(b));

  const orderedCats = [...knownOrder, ...unknown];

  return (
    <div className="services-container">
      <div className="services-wrap">
        <h2 className="services-title">Nos soins & tarifs</h2>
        <p className="services-sub">Tarifs indicatifs – modifiables à tout moment via l’admin.</p>

        {orderedCats.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center" }}>Aucun soin pour le moment.</p>
        ) : (
          orderedCats.map((cat) => {
            const list = byCat[cat] || [];
            const sorted = [...list].sort((a, b) => {
              const oa = a.order ?? 9999;
              const ob = b.order ?? 9999;
              if (oa !== ob) return oa - ob;
              return a.name.localeCompare(b.name);
            });

            return (
              <section key={cat} className="services-section">
                {/* Catégorie en couleur spécifique */}
                <h3 className="services-cat" style={{ color: "#7D6C71" }}>
                  {cat}
                </h3>

                <div className="services-list">
                  {sorted.map((s) => {
                    const dur = formatDuration(s);
                    return (
                      <div key={s.id} className="service-row" style={{ marginBottom: s.spacing ?? 10 }}>
                        <div className="service-line">
                          {/* Nom + Durée en noir */}
                          <span className="service-name" style={{ color: "#000", fontWeight: 500 }}>
                            {s.name}
                            {dur ? (
                              <span style={{ marginLeft: 8, color: "#000", fontWeight: 400 }}>
                                ({dur})
                              </span>
                            ) : null}
                          </span>
                          <span className="service-fill" aria-hidden="true" />
                          <strong className="service-price">{formatPrice(s)}</strong>
                        </div>
                        {s.description ? (
                          <div className="service-meta">
                            <span className="service-desc">{s.description}</span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
