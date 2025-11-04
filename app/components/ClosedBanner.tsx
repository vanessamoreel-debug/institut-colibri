// /app/components/ClosedBanner.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getSettings() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/settings`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ClosedBanner() {
  const s = await getSettings();
  const enabled = !!s?.closed;
  const message = String(s?.message ?? "").trim();
  if (!enabled || !message) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "8px auto 0",
        padding: "12px 20px",
        borderRadius: 14,
        border: "1px solid rgba(125,108,113,.25)",
        background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.45))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#3d2f34",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: "1.05rem",
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        <span
          aria-hidden
          title="Fermeture"
          style={{
            display: "inline-flex",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#7D6C71",
            color: "#fff",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          !
        </span>
        <span style={{ fontWeight: 600 }}>{message}</span>
      </span>
    </div>
  );
}
