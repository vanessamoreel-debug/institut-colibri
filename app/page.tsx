// /app/page.tsx
import { headers } from "next/headers";
import { Category, Service } from "../types";

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

export default async function Home() {
  // ✅ correction: pas de ']' en trop
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
      <p style={{ marginBottom: 20 }}>
        Consultez nos soins. Les prix sont indicatifs et peuvent être ajustés.
      </p>

      {orderedCats.length === 0 ? (
        <p style={{ color: "#666" }}>Aucun soin pour le moment.</p>
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
            <section key={cat} style={{ marginBottom: 28 }}>
              <h2 style={{ margin: "18px 0 10px" }}>{cat}</h2>
              <div>
                {sorted.map((s) => {
                  const dur = formatDuration(s);
                  return (
                    <div
                      key={s.id}
                      style={{
                        background: "#fff",
                        padding: 14,
                        borderRadius: 10,
                        marginBottom: s.spacing ?? 10, // applique l’espace personnalisé si défini
                        border: "1px solid #eee",
                      }}
                    >
                      <strong>{s.name}</strong>
                      {dur ? <span> {dur}</span> : null}
                      <div style={{ float: "right", fontWeight: 600 }}>
                        {Math.round(s.price)} CHF
                      </div>
                      {s.description ? (
                        <p style={{ margin: "6px 0 0", color: "#555" }}>
                          {s.description}
                        </p>
                      ) : null}
                      <div style={{ clear: "both" }} />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}

      <p style={{ marginTop: 30 }}>
        Accès administrateur : <code>/admin</code>
      </p>
    </>
  );
}
