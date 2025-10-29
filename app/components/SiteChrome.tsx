// app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { children: React.ReactNode };

/* --------- Menu déroulant PUBLIC (intégré) --------- */
function PublicMenuDropdown() {
  const [open, setOpen] = useState(false);

  // referme au back/forward
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  // referme si on clique hors du panneau
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-wrap")) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="menu-wrap">
      <button className="menu-button" onClick={() => setOpen(o => !o)}>
        Menu
      </button>
      <nav className={`menu-panel ${open ? "open" : ""}`}>
        <Link className="menu-link" href="/" onClick={() => setOpen(false)}>Accueil</Link>
        <Link className="menu-link" href="/soins" onClick={() => setOpen(false)}>Soins</Link>
        <Link className="menu-link" href="/a-propos" onClick={() => setOpen(false)}>À propos</Link>
        <Link className="menu-link" href="/contact" onClick={() => setOpen(false)}>Contact</Link>
      </nav>
    </div>
  );
}

/* --------- Menu déroulant ADMIN (intégré) --------- */
function AdminMenuDropdown() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-wrap")) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="menu-wrap">
      <button className="menu-button" onClick={() => setOpen(o => !o)}>
        Menu admin
      </button>
      <nav className={`menu-panel ${open ? "open" : ""}`}>
        <Link className="menu-link" href="/admin" onClick={() => setOpen(false)}>Dashboard</Link>
        <Link className="menu-link" href="/admin/promo" onClick={() => setOpen(false)}>Promo</Link>
        {/* Ajoute d'autres entrées si besoin */}
      </nav>
    </div>
  );
}

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "admin-shell" : undefined}>
      <header className="site-header">
        {/* Zone gauche (vide) — en admin elle est masquée par CSS */}
        <div className="header-left" />

        {/* Titre centré */}
        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>

        {/* Menu à droite (public ou admin) */}
        <div className="header-right">
          {isAdmin ? <AdminMenuDropdown /> : <PublicMenuDropdown />}
        </div>
      </header>

      <main className="site-main">{children}</main>
    </div>
  );
}
