// app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

type Props = { children: React.ReactNode };

/* --------- Menu déroulant PUBLIC (utilise les classes CSS existantes) --------- */
function PublicMenuDropdown() {
  const [open, setOpen] = useState(false);

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".menu-wrap")) setOpen(false);
  }, []);

  const handlePopState = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleDocumentClick, handlePopState]);

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

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  // Public ↔ Admin : gère la classe du body pour l'arrière-plan public
  useEffect(() => {
    const body = document.body;
    if (!isAdmin) body.classList.add("body-public");
    else body.classList.remove("body-public");
  }, [isAdmin]);

  // ⚠️ Important : l'admin a son propre layout (/app/(admin)/layout.tsx).
  // Donc ici, on N'AFFICHE PAS le header public quand on est en /admin.
  if (isAdmin) {
    return <main className="site-main">{children}</main>;
  }

  // ---- Site public : header chic + grand titre centré + menu déroulant ----
  return (
    <div>
      <header className="site-header">
        <div className="header-left" />
        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>
        <div className="header-right">
          <PublicMenuDropdown />
        </div>
      </header>

      <main className="site-main">{children}</main>
    </div>
  );
}
