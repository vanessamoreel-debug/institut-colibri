// /app/contact/page.tsx
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // pas de SSG/caching

async function getPage(slug: string) {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/pages?slug=${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

/** Échappe le HTML (sécurité) */
function escapeHtml(s: string) {
  return s
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;")
    .replaceAll(/"/g, "&quot;");
}

/** Garde seulement les chiffres d’un numéro (utile pour tel: et wa.me) */
function digitsOnly(s: string) {
  const d = s.replace(/[^\d]/g, "");
  return d.startsWith("00") ? d.slice(2) : d; // normalise "00.." → international
}

/** Transforme le corps en HTML avec icônes + liens */
function linkifyContact(body: string): string {
  const lines = body.split(/\r?\n/);

  const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const phoneRe = /(?:\+?\d[\d\s().-]{6,}\d)/g;
  const waHintRe = /\bwhats?app\b/i;

  const htmlLines = lines.map((rawLine) => {
    let line = escapeHtml(rawLine);

    // Emails ✉️
    line = line.replace(emailRe, (m) => {
      const href = `mailto:${m}`;
      return `<a href="${href}">✉️ ${m}</a>`;
    });

    // Téléphones 📞
    line = line.replace(phoneRe, (m) => {
      if (m.includes("&lt;") || m.includes("&gt;")) return m;
      const digits = digitsOnly(m);
      if (digits.length < 6) return m;
      const href = `tel:+${digits.startsWith("0") ? digits : digits}`;
      return `<a href="${href}">📞 ${m}</a>`;
    });

    // WhatsApp 💬
    if (waHintRe.test(rawLine)) {
      const match = rawLine.match(phoneRe);
      if (match?.[0]) {
        const w = digitsOnly(match[0]);
        if (w.length >= 6) {
          const url = `https://wa.me/${w}`;
          line = line.replace(
            /(Whats?App)/i,
            `<a href="${url}" target="_blank" rel="noopener">💬 $1</a>`
          );
        }
      }
    }

    // Adresse 📍
    const looksLikeAddress =
      /\d/.test(rawLine) &&
      /(rue|avenue|av\.?|chemin|ch\.?|route|place|bd|boulevard|impasse|quai|grand[-\s]rue|pl\.?)/i.test(
        rawLine
      ) &&
      !emailRe.test(rawLine);

    if (looksLikeAddress) {
      const q = encodeURIComponent(rawLine.trim());
      const maps = `https://www.google.com/maps/search/?api=1&query=${q}`;
      line = `<a href="${maps}" target="_blank" rel="noopener">📍 ${line}</a>`;
    }

    return line;
  });

  return htmlLines
    .map((l) => (l.trim() === "" ? "<br/>" : `<p style="margin:6px 0">${l}</p>`))
    .join("");
}

export default async function ContactPage() {
  const data = await getPage("contact");
  const title = data?.title || "Contact";
  const body = data?.body || "Adresse, téléphone, e-mail, horaires…";

  const html = linkifyContact(body);

  return (
    <div className="pricelist info-panel">
      <h2 className="page-title">{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
