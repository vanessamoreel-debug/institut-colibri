// /app/components/SiteChrome.tsx
import Link from "next/link";
import Menu from "./Menu";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      {/* Header complet */}
      <header className="site-header">
        {/* Groupe logo + titre centré */}
        <div className="title-group">
          <Link href="/" className="logo-title-link" aria-label="Accueil Institut Colibri">
            <img
  src="/logo-colibri-2.png"
  alt="Logo Institut Colibri"
  className="site-logo-large"
/>
            <span className="site-title-text">Institut Colibri</span>
          </Link>
        </div>

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
