// /app/components/SiteChrome.tsx
import Link from "next/link";
import Menu from "./Menu";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      {/* HEADER */}
      <header className="site-header">
        {/* Logo à gauche */}
        <div className="header-left">
          <img
            src="/logo-colibri-3.png"
            alt="Logo Institut Colibri"
            className="site-logo-xxl"
          />
        </div>

        {/* Titre parfaitement centré */}
        <div className="header-center">
          <Link
            href="/"
            className="site-title-text"
            style={{ textDecoration: "none" }}
          >
            Institut&nbsp;Colibri
          </Link>
        </div>

        {/* Menu à droite */}
        <div className="header-right">
          <Menu />
        </div>
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
