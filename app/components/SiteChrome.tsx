// /app/components/SiteChrome.tsx
import Link from "next/link";
import Menu from "./Menu";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      {/* HEADER */}
      <header className="site-header">
        {/* Groupe logo + titre centré */}
        <div className="logo-title-center">
          <Link href="/" className="logo-title-link" aria-label="Accueil Institut Colibri">
            <img
              src="/logo-colibri-3.png"
              alt="Logo Institut Colibri"
              className="site-logo-xxl"
            />
            <span className="site-title-text">Institut&nbsp;Colibri</span>
          </Link>
        </div>

        {/* Menu à droite */}
        <Menu />
      </header>

      {/* CONTENU */}
      <main className="site-main">{children}</main>

      {/* FOOTER */}
      <footer className="site-footer">
        <span>© Institut Colibri 2025</span>
      </footer>
    </div>
  );
}
