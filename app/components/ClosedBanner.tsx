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
  const enabled = !!s?.closed || !!s?.closedBanner?.enabled;
  const message = (s?.message ?? s?.closedBanner?.message ?? "").trim();
  if (!enabled || !message) return null;

  return (
    <div className="mx-auto max-w-6xl card p-3 text-center text-red-700 font-body">
      {message}
    </div>
  );
}
