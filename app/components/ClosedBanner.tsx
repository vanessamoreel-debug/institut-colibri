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
  const { closed, message } = await getSettings();

  if (!closed) return null;

  return (
    <div className="closed-banner" role="status" aria-live="polite">
      <div className="closed-banner__inner">
        {message?.trim() ? message : "L’institut est momentanément fermé."}
      </div>
    </div>
  );
}
