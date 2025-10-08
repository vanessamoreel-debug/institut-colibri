// /app/components/ClosedBanner.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getSettings() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/settings`, { cache: "no-store" });
  if (!res.ok) return { closed: false, closedMessage: "" };
  return res.json();
}

export default async function ClosedBanner() {
  const { closed, closedMessage } = await getSettings();
  if (!closed) return null;

  return (
    <div
      className="card"
      style={{
        background: "rgba(255, 230, 230, 0.6)",
        borderColor: "rgba(200, 80, 80, 0.35)",
        color: "#4a2a2a",
        marginBottom: 12,
      }}
    >
      <strong style={{ display: "block", marginBottom: 4 }}>
        L’institut est temporairement fermé
      </strong>
      <div style={{ whiteSpace: "pre-wrap" }}>{closedMessage || "—"}</div>
    </div>
  );
}
