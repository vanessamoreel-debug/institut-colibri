// /app/components/ClosedBanner.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getSettings() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/settings`, { cache: "no-store" });
  if (!res.ok) return { closed: false, message: "" };
  return res.json();
}

export default async function ClosedBanner() {
  const settings = await getSettings();
  if (!settings.closed) return null;

  return (
    <div
      style={{
        background: "rgba(125, 108, 113, 0.10)",
        border: "1px solid rgba(125, 108, 113, 0.25)",
        borderRadius: 12,
        padding: "10px 14px",
        margin: "0 0 12px 0",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      className="card"
    >
      <strong style={{ color: "#7D6C71" }}>Information :</strong>{" "}
      <span>{settings.message || "L’institut est actuellement fermé."}</span>
    </div>
  );
}
