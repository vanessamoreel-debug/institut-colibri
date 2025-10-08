// /app/components/Menu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Fermer à chaque changement de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Fermer en cliquant à l'extérieur
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // Fermer avec Echap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="menu-wrap" ref={ref}>
      <button className="menu-button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="menu-icon">☰</span>
        Menu <span className={`chevron ${open ? "chevron-up" : ""}`}>⌄</span>
      </button>

      <nav className={`menu-panel ${open ? "open" : ""}`}>
        <Link href="/"         className="menu-link" onClick={() => setOpen(false)}>Accueil</Link>
        <Link href="/soins"    className="menu-link" onClick={() => setOpen(false)}>Soins</Link>
        <Link href="/contact"  className="menu-link" onClick={() => setOpen(false)}>Contact</Link>
        <Link href="/a-propos" className="menu-link" onClick={() => setOpen(false)}>À propos</Link>
        <Link href="/admin"    className="menu-link" onClick={() => setOpen(false)}>Admin</Link>
      </nav>
    </div>
  );
}
