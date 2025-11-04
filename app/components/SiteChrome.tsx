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

/** Fermeture inline (client) — même design/poids/couleur que Promo */
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
    <div className="colibri-banner" role="status" aria-live="polite">
      <span className="colibri-banner__chip" aria-hidden title="Fermeture">!</span>
      <span className="colibri-banner__text">{text}</span>
    </div>
  );
}

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const body = document.body;
    if (!isAdmin) body.classList.add("body-public");
    else body.classList.remove("body-public");
  }, [isAdmin]);

  if (isAdmin) {
    return <main className="site-main">{children}</main>;
  }

  return (
    <div>
      {/* HEADER : uniquement le titre et le menu → reste centré */}
      <header className="site-header" style={{ marginBottom: 0 }}>
        <div className="header-left" />
        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>
        <div className="header-right">
          <PublicMenuDropdown />
        </div>
      </header>

      {/* Bannières sous le titre, centrées, l'une sous l'autre */}
      <div className="after-site-title">
        <ClosedBannerInline />
        <PromoBanner />
      </div>

      {/* Contenu public : collé au plus près des bannières */}
      <main className="site-main site-main--tight">
        {children}
      </main>
    </div>
  );
}
