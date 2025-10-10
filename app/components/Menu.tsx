// /app/components/Menu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Menu déroulant du site public (aligné à droite, liste verticale, sans chevron) */
export default function Menu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // fermer si clic à l’extérieur
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // fermer avec Échap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const Item = ({ href, label }: { href: string; label: string }) => {
    const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={`menu-link ${active ? "active" : ""}`}
        onClick={() => setOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        className="menu-button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          // style demandé : couleur marque + typo
          color: "#7D6C71",
          fontFamily: "'Playfair Display', serif",
          fontWeight: 600,
        }}
      >
        Menu
      </button>

      <nav className={`menu-panel ${open ? "open" : ""}`} role="menu">
        <Item href="/" label="Accueil" />
        <Item href="/soins" label="Soins" />
        <Item href="/contact" label="Contact" />
        <Item href="/a-propos" label="À propos" />
      </nav>
    </div>
  );
}
