// app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { children: React.ReactNode };

/* --------- MENU PUBLIC --------- */
function PublicMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-wrap")) setOpen(false);
    });
    return () => {
      window.removeEventListener("popstate", close);
      document.removeEventListener("click", (e) => {});
    };
  }, []);

  return (
    <div className="menu-wrap relative">
      <button
        className="menu-button"
        onClick={() => setOpen((o) => !o)}
      >
        ☰ Menu
      </button>
      <nav
        className={`absolute right-0 mt-2 rounded-xl bg-white/90 shadow-lg backdrop-blur-md transition-all duration-200 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul className="flex flex-col min-w-[180px] text-[var(--brand)] font-medium">
          <li><Link href="/" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">Accueil</Link></li>
          <li><Link href="/soins" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">Soins</Link></li>
          <li><Link href="/a-propos" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">À propos</Link></li>
          <li><Link href="/contact" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">Contact</Link></li>
        </ul>
      </nav>
    </div>
  );
}

/* --------- MENU ADMIN --------- */
function AdminMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="menu-wrap relative">
      <button
        className="menu-button"
        onClick={() => setOpen((o) => !o)}
      >
        ⚙️ Admin
      </button>
      <nav
        className={`absolute right-0 mt-2 rounded-xl bg-white/90 shadow-lg backdrop-blur-md transition-all duration-200 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul className="flex flex-col min-w-[180px] text-[var(--brand)] font-medium">
          <li><Link href="/admin?tab=soins" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">Soins</Link></li>
          <li><Link href="/admin?tab=contact" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">Contact</Link></li>
          <li><Link href="/admin?tab=a-propos" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">À propos</Link></li>
          <li><Link href="/admin?tab=fermeture" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">Fermeture</Link></li>
          <li><Link href="/admin?tab=promo" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">Promo</Link></li>
          <li><Link href="/" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-[var(--brand)] hover:text-white">↩ Retour au site</Link></li>
        </ul>
      </nav>
    </div>
  );
}

/* --------- STRUCTURE PRINCIPALE --------- */
export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  // ajoute ou retire la classe body-public pour le fond
  useEffect(() => {
    const body = document.querySelector("body");
    if (!isAdmin) body?.classList.add("body-public");
    else body?.classList.remove("body-public");
  }, [isAdmin]);

  return (
    <div className={isAdmin ? "admin-shell" : ""}>
      {/* HEADER FIXE */}
      <header
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-3 ${
          isAdmin ? "bg-white/90 shadow-md" : "bg-white/70 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="text-lg font-semibold text-[var(--brand)]">
          {isAdmin ? "Institut Colibri — Administration" : ""}
        </div>
        {!isAdmin && (
          <div className="text-2xl font-serif tracking-wide text-[var(--brand)]">
            INSTITUT&nbsp;COLIBRI
          </div>
        )}
        <div>
          {isAdmin ? <AdminMenu /> : <PublicMenu />}
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="pt-24 px-4 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
