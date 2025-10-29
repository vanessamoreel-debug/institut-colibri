// app/components/admin/MenuAdmin.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export type Tab = "dashboard" | "services" | "categories" | "pages" | "settings";

// Props optionnelles (compat si tu en ajoutes plus tard)
type Props = {
  tab?: Tab;
  setTab?: (t: Tab) => void;
};

export default function MenuAdmin(_props: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fermer sur clic extérieur
  useEffect(() => {
    function onDocClick(e: MouseEvent | TouchEvent) {
      if (!ref.current) return;
      const target = e.target as Node;
      if (!ref.current.contains(target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, []);

  // Fermer sur ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Fermer quand la route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = () => setOpen(false);

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        type="button"
        className="menu-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        Menu admin
      </button>

      <div className={`menu-panel ${open ? "open" : ""}`} role="menu" aria-label="Administration">
        <Link className="menu-link" href="/admin" onClick={close}>Dashboard</Link>
        <Link className="menu-link" href="/admin?tab=services" onClick={close}>Soins</Link>
        <Link className="menu-link" href="/admin?tab=categories" onClick={close}>Catégories</Link>
        <Link className="menu-link" href="/admin?tab=pages" onClick={close}>Pages</Link>
        <Link className="menu-link" href="/admin?tab=settings" onClick={close}>Paramètres</Link>
      </div>
    </div>
  );
}
