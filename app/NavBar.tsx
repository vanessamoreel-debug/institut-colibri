// /app/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/soins", label: "Soins" },
  { href: "/contact", label: "Contact" },
  { href: "/a-propos", label: "À propos" },
  { href: "/admin", label: "Admin" }, // utile pour toi; on peut le masquer au public plus tard
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer si clic à l’extérieur
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="menu-wrap" ref={menuRef}>
      <button
        className="menu-button"
        aria-expanded={open}
        aria-controls="main-menu"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
        <span className={open ? "chevron chevron-up" : "chevron"} aria-hidden>
          ▾
        </span>
      </button>

      <div
        id="main-menu"
        className={open ? "menu-panel open" : "menu-panel"}
        role="menu"
        aria-label="Navigation principale"
      >
        {LINKS.map((l) => {
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
