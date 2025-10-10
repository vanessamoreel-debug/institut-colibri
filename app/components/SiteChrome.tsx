// /app/components/SiteChrome.tsx
import Link from "next/link";
import Menu from "./Menu";

/** En-tête du site public : grand titre + menu déroulant */
export default function SiteChrome() {
  return (
    <header className="site-header">
      {/* Titre cliquable vers l’accueil */}
      <Link href="/" className="site-title" style={{ textDecoration: "none" }}>
        Institut Colibri
      </Link>

      {/* Menu déroulant (Accueil, Soins, Contact, À propos) */}
      <Menu />
    </header>
  );
}
