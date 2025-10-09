// /app/admin/layout.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Petit menu déroulant (en haut à droite) pour naviguer entre les sections admin
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="admin-shell">
      {/* Barre supérieure admin */}
      <div className="admin-topbar">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div className="admin-topbar-title">Tableau de bord — Administration</div>

          {/* Menu admin (droite) */}
          <div className="menu-wrap" ref={ref}>
            <button className="menu-button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
              <span className="menu-icon">☰</span>
              Sections admin <span className={`chevron ${open ? "chevron-up" : ""}`}>⌄</span>
            </button>

            <nav className={`menu-panel ${open ? "open" : ""}`}>
              {/* Liens internes admin : ces routes existent déjà dans la page admin via onglets.
                  Ici on renvoie vers /admin mais avec hash de section pour scroller. */}
              <a href="/admin#soins"     className="menu-link" onClick={() => setOpen(false)}>Soins</a>
              <a href="/admin#contact"   className="menu-link" onClick={() => setOpen(false)}>Contact</a>
              <a href="/admin#a-propos"  className="menu-link" onClick={() => setOpen(false)}>À propos</a>
              <a href="/admin#fermeture" className="menu-link" onClick={() => setOpen(false)}>Fermeture</a>
              <a href="/admin#promo"     className="menu-link" onClick={() => setOpen(false)}>Promo</a>
              {/* Bouton retour au site public */}
              <Link href="/" className="menu-link" onClick={() => setOpen(false)}>↩️ Retour au site</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu admin */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
// /app/admin/layout.tsx
import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-title">Tableau de bord</div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
