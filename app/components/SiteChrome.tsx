// /app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import PromoBanner from "./PromoBanner";

type Props = { children: React.ReactNode };

/* --------- Menu déroulant PUBLIC --------- */
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
      <button className="menu-button" onClick={() => setOpen((o) => !o)}>
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

/** Fermeture inline (client) — même design/poids que PromoBanner */
function ClosedBannerInline() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const j = res.ok ? await res.json() : {};
        if (!mounted) return;
        const enabled = !!j?.closed;
        const message = String(j?.message ?? "").trim();
        setActive(enabled && !!message);
        setText(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading || !active) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "6px auto 6px",
        padding: "12px 20px",
        borderRadius: 14,
        border: "1px solid rgba(125,108,113,.25)",
        background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.45))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#7D6C71",           // même couleur que la promo
        textAlign: "center",
        fontWeight: 500,            // même poids que demandé
        fontFamily: "inherit",      // suit la même police que le site
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: "1.05rem",
          lineHeight: 1.4,
        }}
      >
        <span
          aria-hidden
          title="Fermeture"
          style={{
            display: "inline-flex",
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#7D6C71",
            color: "#fff",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          !
        </span>
        <span style={{ fontWeight: 600 }}>{text}</span>
      </span>
    </div>
  );
}

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  // Public ↔ Admin : classe body
  useEffect(() => {
    const body = document.body;
    if (!isAdmin) body.classList.add("body-public");
    else body.classList.remove("body-public");
  }, [isAdmin]);

  // Admin : layout séparé
  if (isAdmin) {
    return <main className="site-main">{children}</main>;
  }

  // Public
  return (
    <div>
      {/* HEADER UNIQUEMENT LE TITRE + MENU (rien d'autre) */}
      <header className="site-header" style={{ marginBottom: 0 }}>
        <div className="header-left" />
        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>
        <div className="header-right">
          <PublicMenuDropdown />
        </div>
      </header>

      {/* ⬇️ Bannières PLEINE LARGEUR CENTRÉES, SOUS le titre, sans décentrer le header */}
      <div style={{ width: "100%", maxWidth: 900, margin: "8px auto 6px" }}>
        <ClosedBannerInline />
        <PromoBanner />
      </div>

      {/* Contenu public : on remonte au plus près des bannières */}
      <main className="site-main" style={{ paddingTop: 0, marginTop: 0 }}>
        {children}
      </main>
    </div>
  );
}
