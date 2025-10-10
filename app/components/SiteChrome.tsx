// /app/components/SiteChrome.tsx
import Link from "next/link";
import Menu from "./Menu";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      {/* Header complet */}
      <header className="site-header">
        {/* Logo à gauche */}
        <Link href="/" className="logo-link" aria-label="Accueil Institut Colibri">
          <img src="/Logo.png" alt="Logo Institut Colibri" className="site-logo" />
        </Link>

        {/* Titre au centre */}
        <h1 className="site-title">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Institut Colibri
          </Link>
        </h1>

        {/* Menu à droite */}
        <Menu />
      </header>

      {/* Contenu principal */}
      <main className="site-main">{children}</main>

      {/* Footer */}
      <footer className="site-footer">
        <span>© Institut Colibri 2025</span>
      </footer>
    </div>
  );
}
