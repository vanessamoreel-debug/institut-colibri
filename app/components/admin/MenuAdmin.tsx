// app/components/admin/MenuAdmin.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Tab = "soins" | "contact" | "a-propos" | "fermeture" | "promo";

export default function MenuAdmin() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // Fermer au clic en dehors
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Fermer quand la route change (ex: après push ?tab=…)
  useEffect(() => {
    setOpen(false);
  }, [pathname, sp?.toString()]);

  function go(tab: Tab) {
    router.push(`/admin?tab=${tab}`);
    // on ne set pas open ici; il se fermera via l’effet sur route
  }

  return (
    <div className="menu-wrap">
      <button
        ref={btnRef}
        className="menu-button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Menu Admin
      </button>

      <div
        ref={panelRef}
        className={`menu-panel${open ? " open" : ""}`}
        role="menu"
        aria-label="Menu Administrateur"
      >
        <a className="menu-link" href="#" onClick={(e) => { e.preventDefault(); go("soins"); }}>Soins</a>
        <a className="menu-link" href="#" onClick={(e) => { e.preventDefault(); go("contact"); }}>Contact</a>
        <a className="menu-link" href="#" onClick={(e) => { e.preventDefault(); go("a-propos"); }}>À propos</a>
        <a className="menu-link" href="#" onClick={(e) => { e.preventDefault(); go("fermeture"); }}>Fermeture</a>
        <a className="menu-link" href="#" onClick={(e) => { e.preventDefault(); go("promo"); }}>Promo</a>

        <hr style={{ border: 0, borderTop: "1px solid rgba(125,108,113,0.25)", margin: "6px 0" }} />

        <a
          className="menu-link"
          href="#"
          onClick={async (e) => {
            e.preventDefault();
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            router.replace("/login");
          }}
        >
          Se déconnecter
        </a>
      </div>
    </div>
  );
}
