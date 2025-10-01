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

  const byCat = services.reduce<Record<string, Service[]>>((acc, s) => {
    const k = s.category || "AUTRES";
    (acc[k] ||= []).push(s);
    return acc;
  }, {});

  const presentCats = Object.keys(byCat);

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
    <>
      <h2>Nos soins</h2>
      <p style={{ marginBottom: 20 }}>Tarifs indicatifs. Réglages via l’admin.</p>

      {orderedCats.map((cat) => {
        const list = byCat[cat] || [];
        const sorted = [...list].sort((a, b) => {
          const oa = a.order ?? 9999;
          const ob = b.order ?? 9999;
          if (oa !== ob) return oa - ob;
          return a.name.localeCompare(b.name);
        });

        return (
          <section key={cat} style={{ marginBottom: 28 }}>
            <h3 style={{ margin: "18px 0 10px" }}>{cat}</h3>
            <div>
              {sorted.map((s) => {
                const dur = formatDuration(s);
                return (
                 <div key={s.id} className="card" style={{ marginBottom: s.spacing ?? 10 }}>
                    <strong>{s.name}</strong>
                    {dur ? <span> {dur}</span> : null}
                    <div style={{ float: "right", fontWeight: 600 }}>{formatPrice(s)}</div>
                    {s.description ? (
                      <p style={{ margin: "6px 0 0", color: "#555" }}>{s.description}</p>
                    ) : null}
                    <div style={{ clear: "both" }} />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
