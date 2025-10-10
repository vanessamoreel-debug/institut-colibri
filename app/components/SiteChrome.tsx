// /app/components/SiteChrome.tsx
import Link from "next/link";
import Menu from "./Menu";

/** En-tête du site public : grand titre + menu (à droite) */
export default function SiteChrome() {
  return (
    <header className="site-header" role="banner" aria-label="En-tête du site">
      <Link
        href="/"
        className="site-title"
        style={{ textDecoration: "none" }}
        aria-label="Aller à l’accueil Institut Colibri"
      >
        Institut Colibri
      </Link>

      <nav aria-label="Navigation principale">
        <Menu />
      </nav>
    </header>
  );
}
