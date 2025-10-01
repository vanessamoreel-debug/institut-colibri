// /app/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PUBLIC_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/soins", label: "Soins" },
  { href: "/contact", label: "Contact" },
  { href: "/a-propos", label: "À propos" },
];
const ADMIN_LINK = { href: "/admin", label: "Admin" };

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Clic à l’extérieur → fermer
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  // Changement de page → fermer
  useEffect(() => setOpen(false), [pathname]);

  // Vérifier si connecté admin (cookie)
  useEffect(() => {
    fetch("/api/auth/status", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => setShowAdmin(!!j?.authed))
      .catch(() => setShowAdmin(false));
  }, []);

  const links = showAdmin ? [...PUBLIC_LINKS, ADMIN_LINK] : PUBLIC_LINKS;

  return (
    <div className="menu-wrap" ref={menuRef}>
      <button
        className="menu-button"
        aria-expanded={open}
        aria-controls="main-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-icon" aria-hidden>☰</span>
        <span>Menu</span>
        <span className={open ? "chevron chevron-up" : "chevron"} aria-hidden>▾</span>
      </button>

      <div
        id="main-menu"
        className={open ? "menu-panel open" : "menu-panel"}
        role="menu"
        aria-label="Navigation principale"
      >
        {links.map((l) => {
          const isActive =
            l.href === "/"
              ? pathname === "/"
              : pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              className={isActive ? "menu-link active" : "menu-link"}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
