"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuAdmin from "./MenuAdmin"; // menu admin (à droite)

function PublicMenuDropdown() {
  return (
    <div className="menu-wrap">
      <button
        className="menu-button"
        onClick={(e) => {
          const panel = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (panel) panel.classList.toggle("open");
        }}
      >
        Menu
      </button>
      <div className="menu-panel">
        <Link className="menu-link" href="/">Accueil</Link>
        <Link className="menu-link" href="/soins">Soins</Link>
        <Link className="menu-link" href="/a-propos">À&nbsp;propos</Link>
        <Link className="menu-link" href="/contact">Contact</Link>
      </div>
    </div>
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* En-tête */}
      <header className={`site-header ${isAdmin ? "admin-shell" : ""}`}>
        {/* header-left : on NE L'AFFICHE PAS en admin (donc plus de menu inline à gauche) */}
        {!isAdmin && <div className="header-left" />}

        {/* Titre centré */}
        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>

        {/* À droite : dropdown (admin ou public) */}
        <div className="header-right">
          {isAdmin ? <MenuAdmin /> : <PublicMenuDropdown />}
        </div>
      </header>

      {/* Contenu */}
      <main className="site-main">{children}</main>
    </>
  );
}
