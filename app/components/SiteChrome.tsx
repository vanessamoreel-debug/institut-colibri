// components/SiteChrome.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteChrome({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className={isAdmin ? "admin-shell" : ""}>
      {/* ====== HEADER ====== */}
      <header className="site-header">
        {/* GAUCHE : masqué en admin via CSS si besoin */}
        {!isAdmin && <div className="header-left">{/* (menu catégories, si tu le gardes) */}</div>}

        {/* CENTRE : titre */}
        <div className="header-center">
          <Link href="/" className="site-title-text">Institut Colibri</Link>
        </div>

        {/* DROITE : menu déroulant */}
        <div className="header-right">
          <div className="menu-wrap">
            {/* ton bouton + panneau du menu existent déjà dans le projet */}
          </div>
        </div>
      </header>

      {/* Si on te passe des children, on les rend ici (sinon rien) */}
      {children ? <main className="site-main">{children}</main> : null}

      {/* ====== FOOTER ====== */}
      <footer className="site-footer">
        <span>© Institut Colibri 2025</span>
      </footer>
    </div>
  );
}
