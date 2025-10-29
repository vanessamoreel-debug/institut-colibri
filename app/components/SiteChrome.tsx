// app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "./admin/Menu";
import MenuAdmin from "./admin/MenuAdmin";

type Props = { children: React.ReactNode };

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  return (
    // Classe admin-shell en admin → permet à ton CSS d’appliquer les styles admin
    <div className={isAdmin ? "admin-shell" : undefined}>
      <header className="site-header">
        {/* ⛔ Menu inline gauche SUPPRIMÉ en admin */}
        {!isAdmin && <div className="header-left">{/* (vide côté public) */}</div>}

        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>

        <div className="header-right">
          {isAdmin ? <MenuAdmin /> : <Menu />}
        </div>
      </header>

      {/* Le contenu des pages */}
      <main className="site-main">{children}</main>
    </div>
  );
}
