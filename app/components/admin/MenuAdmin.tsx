// app/components/admin/MenuAdmin.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MenuAdmin() {
  const [open, setOpen] = useState(false);

  // referme le menu au changement de route (sécurité)
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <div className="menu-wrap">
      <button className="menu-button" onClick={() => setOpen(o => !o)}>Menu admin</button>
      <nav className={`menu-panel ${open ? "open" : ""}`}>
        <Link className="menu-link" href="/admin">Dashboard</Link>
        <Link className="menu-link" href="/admin/promo">Promo</Link>
        {/* ajoute tes autres entrées ici */}
      </nav>
    </div>
  );
}
