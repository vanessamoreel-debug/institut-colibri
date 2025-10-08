// /app/contact/page.tsx
import { headers } from "next/headers";
import ClosedBanner from "../components/ClosedBanner";

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

/** Transforme le corps en HTML avec icônes + liens */
function linkifyContact(body: string): string {
  const lines = body.split(/\r?\n/);

  const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const phoneRe = /(?:\+?\d[\d\s().-]{6,}\d)/g;
  const waHintRe = /\bwhats?app\b/i;

  const whatsappUrl = `https://wa.me/41795307564`; // ✅ ton numéro WhatsApp
  const whatsappIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"
         style="vertical-align:middle; margin-right:6px">
      <path fill="#25D366" d="M16 0C7.163 0 0 7.163 0 16c0 2.82.733 5.527 2.126 7.937L0 32l8.297-2.08A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0z"/>
      <path fill="#FFF" d="M24.26 19.58c-.367-.184-2.172-1.07-2.508-1.191-.337-.123-.584-.184-.83.185-.246.367-.953 1.191-1.169 1.438-.215.246-.43.277-.797.092-.367-.184-1.548-.57-2.947-1.817-1.089-.97-1.823-2.17-2.038-2.537-.215-.367-.023-.565.161-.749.166-.165.368-.43.552-.645.185-.215.246-.368.369-.614.122-.246.061-.461-.03-.645-.092-.184-.83-1.997-1.137-2.737-.299-.718-.602-.62-.83-.63l-.707-.013c-.246 0-.645.092-.983.461-.337.368-1.291 1.262-1.291 3.077s1.322 3.564 1.506 3.809c.184.246 2.602 3.978 6.308 5.573.882.379 1.568.605 2.105.773.885.28 1.691.24 2.326.146.709-.106 2.172-.889 2.479-1.748.307-.86.307-1.597.215-1.748-.091-.151-.337-.245-.704-.429z"/>
    </svg>`;

  const htmlLines = lines.map((rawLine) => {
    let line = escapeHtml(rawLine);

    // 👉 Mise en avant spéciale de la ligne “Ouvert uniquement sur rendez-vous”
    const norm = rawLine
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (norm.includes("ouvert uniquement sur rendez-vous")) {
      line = `<span class="notice-strong">${line}</span>`;
    }

    // ✉️ E-mails
    line = line.replace(emailRe, (m) => {
      const href = `mailto:${m}`;
      return `<a class="link-clean" href="${href}">✉️ ${m}</a>`;
    });

    // 📞 Téléphones
    line = line.replace(phoneRe, (m) => {
      if (m.includes("&lt;") || m.includes("&gt;")) return m;
      const href = `tel:${m.replace(/\s+/g, "")}`;
      return `<a class="link-clean" href="${href}">📞 ${m}</a>`;
    });

    // 💬 WhatsApp — remplace “WhatsApp” par le lien avec icône (sans afficher le numéro)
    if (waHintRe.test(rawLine)) {
      line = `<a class="link-clean" href="${whatsappUrl}" target="_blank" rel="noopener">${whatsappIcon}WhatsApp</a>`;
    }

    // 📍 Adresse — ajoute “Institut Colibri” dans la recherche
    const looksLikeAddress =
      /\d/.test(rawLine) &&
      /(rue|avenue|av\.?|chemin|ch\.?|route|place|bd|boulevard|impasse|quai|grand[-\s]rue|pl\.?)/i.test(rawLine) &&
      !emailRe.test(rawLine);

    if (looksLikeAddress) {
      const hasBrand = /institut\s+colibri/i.test(rawLine);
      const query = hasBrand ? rawLine.trim() : `Institut Colibri, ${rawLine.trim()}`;
      const q = encodeURIComponent(query);
      const maps = `https://www.google.com/maps/search/?api=1&query=${q}`;
      line = `<a class="link-clean" href="${maps}" target="_blank" rel="noopener">📍 ${line}</a>`;
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
    <>
      <ClosedBanner />
      <div className="pricelist info-panel">
        <h2 className="page-title">{title}</h2>
        <div className="page-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
