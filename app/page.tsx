import { Service } from "../types";

async function getServices(): Promise<Service[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const res = await fetch(`${base}/api/services`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const services = await getServices();

  const byCat = services.reduce<Record<string, Service[]>>((acc, s) => {
    const k = s.category || "Autres";
    (acc[k] ||= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <p style={{ marginBottom: 20 }}>
        Consultez nos soins. Les prix sont indicatifs et peuvent être ajustés.
      </p>

      {Object.entries(byCat).map(([cat, list]) => (
        <section key={cat} style={{ marginBottom: 28 }}>
          <h2 style={{ margin: "18px 0 10px" }}>{cat}</h2>
          <div>
            {list.map((s) => (
              <div key={s.id} style={{ background: "#fff", padding: 14, borderRadius: 10, marginBottom: 10, border: "1px solid #eee" }}>
                <strong>{s.name}</strong>
                {s.duration ? <span> — {s.duration} min</span> : null}
                <div style={{ float: "right", fontWeight: 600 }}>{s.price.toFixed(0)} CHF</div>
                {s.description ? <p style={{ margin: "6px 0 0", color: "#555" }}>{s.description}</p> : null}
                <div style={{ clear: "both" }} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <p style={{ marginTop: 30 }}>
        Accès administrateur : <code>/admin</code>
      </p>
    </>
  );
}
