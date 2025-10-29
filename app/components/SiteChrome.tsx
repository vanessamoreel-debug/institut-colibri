// components/SiteChrome.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import CategoriesBar from "@/components/CategoriesBar"; // <- si tu as ce composant
import { useState } from "react";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className={isAdmin ? "admin-shell" : "body-public"}>
      <div className="site">
        <header className="site-header">
          {/* GAUCHE : menu catégories (masqué en admin) */}
          {!isAdmin && (
            <div className="header-left">
              {/* <CategoriesBar />  // ou le markup des catégories inline */}
            </div>
          )}

          {/* CENTRE : titre */}
          <div className="header-center">
            <Link href="/" className="site-title-text">Institut Colibri</Link>
          </div>

          {/* DROITE : menu déroulant */}
          <div className="header-right">
            <div className="menu-wrap">
              {/* ... ton bouton + panneau du menu ... */}
            </div>
          </div>
        </header>

        <main className="site-main">{children}</main>

        <footer className="site-footer">
          <span>© Institut Colibri 2025</span>
        </footer>
      </div>
    </div>
  );
}
