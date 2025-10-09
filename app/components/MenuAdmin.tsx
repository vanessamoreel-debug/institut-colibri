// /app/components/MenuAdmin.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Tab = "soins" | "contact" | "a-propos" | "fermeture" | "promo";

export default function MenuAdmin({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ferme si on clique dehors
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // ferme avec Echap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function Item({
    to,
    label,
  }: {
    to: Tab;
    label: string;
  }) {
    const active = tab === to;
    return (
      <button
        onClick={() => {
          setTab(to);
          setOpen(false);
        }}
        className={`menu-link ${active ? "active" : ""}`}
        style={{ width: "100%", textAlign: "left" }}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="menu-wrap" ref={ref}>
      <button
        className="menu-button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="menu-icon">☰</span>
        Menu admin <span className={`chevron ${open ? "chevron-up" : ""}`}>⌄</span>
      </button>

      <nav className={`menu-panel ${open ? "open" : ""}`}>
        <Item to="soins" label="Soins" />
        <Item to="contact" label="Contact" />
        <Item to="a-propos" label="À propos" />
        <Item to="fermeture" label="Fermeture" />
        <Item to="promo" label="Promo" />
      </nav>
    </div>
  );
}
