// app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import PromoBanner from "./PromoBanner";

type Props = { children: React.ReactNode };

/* --------- Menu déroulant PUBLIC (utilise les classes CSS existantes) --------- */
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
        <Link className="menu-link" href="/" onClick={() => setOpen(false)}>
          Accueil
        </Link>
        <Link className="menu-link" href="/soins" onClick={() => setOpen(false)}>
          Soins
        </Link>
        <Link className="menu-link" href="/a-propos" onClick={() => setOpen(false)}>
          À propos
        </Link>
        <Link className="menu-link" href="/contact" onClick={() => setOpen(false)}>
          Contact
        </Link>
      </nav>
    </div>
  );
}

/**
 * Bannière FERMETURE en "client" (même design que PromoBanner),
 * placée SOUS le header (pas dedans) pour ne pas casser l’alignement du titre.
 */
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
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !active) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "12px 20px",
        borderRadius: 14,
        border: "1px solid rgba(125,108,113,.25)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.45))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#3d2f34",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: "1.05rem",
          fontWeight: 500,
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

  // Public ↔ Admin : gère la classe du body pour l'arrière-plan public
  useEffect(() => {
    const body = document.body;
    if (!isAdmin) body.classList.add("body-public");
    else body.classList.remove("body-public");
  }, [isAdmin]);

  // ⚠️ L'admin a son propre layout (/app/(admin)/layout.tsx).
  // Ici, on N'AFFICHE PAS le header public quand on est en /admin.
  if (isAdmin) {
    return <main className="site-main">{children}</main>;
  }

  // ---- Site public : header chic + grand titre centré + menu déroulant ----
  return (
    <div>
      {/* HEADER PUBLIC (titre centré, menu à droite, inchangé) */}
      <header className="site-header">
        <div className="header-left" />
        <div className="header-center">
          <Link href="/" className="site-title-text">
            INSTITUT COLIBRI
          </Link>
        </div>
        <div className="header-right">
          <PublicMenuDropdown />
        </div>
      </header>

      {/* ✅ BANNIÈRES SOUS LE HEADER (jamais à côté du titre) */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "10px auto 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <ClosedBannerInline />
        <PromoBanner />
      </div>

      {/* CONTENU */}
      <main className="site-main">{children}</main>
    </div>
  );
}
