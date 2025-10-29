// components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Props = { children?: React.ReactNode };

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Fermer le menu en cliquant hors du panneau
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (!isAdmin) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isAdmin]);

  // ---------- ADMIN : topbar simple ----------
  if (isAdmin) {
    return (
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="admin-topbar-title">Administration — Institut Colibri</div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    );
  }

  // ---------- SITE CLIENT ----------
  return (
    <>
      <header className="site-header">
        {/* (On supprime le vieux menu “catégories” gauche) */}
        <div className="header-left" />

        {/* Titre centré */}
        <div className="header-center">
          <Link href="/" className="site-title-text">Institut Colibri</Link>
        </div>

        {/* Menu déroulant à droite */}
        <div className="header-right">
          <div className="menu-wrap" data-menu>
            <button
              type="button"
              className="menu-button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen(v => !v)}
            >
              Menu
            </button>

            <div
              ref={panelRef}
              className={`menu-panel${open ? " open" : ""}`}
              role="menu"
            >
              <Link className="menu-link" href="/" onClick={() => setOpen(false)}>Accueil</Link>
              <Link className="menu-link" href="/soins" onClick={() => setOpen(false)}>Soins</Link>
              <Link className="menu-link" href="/a-propos" onClick={() => setOpen(false)}>À&nbsp;propos</Link>
              <Link className="menu-link" href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu des pages */}
      <main className="site-main">{children}</main>
      {/* ⚠️ PAS DE FOOTER ICI (on garde celui du layout) */}
    </>
  );
}
