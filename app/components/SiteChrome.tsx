// /app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import PromoBanner from "./PromoBanner";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
});

type Props = { children: React.ReactNode };

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

/* Bannière fermeture (client) */
function ClosedBannerInline() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const j = res.ok ? await res.json() : {};
      if (!mounted) return;
      setActive(!!j?.closed && !!String(j?.message ?? "").trim());
      setText(String(j?.message ?? ""));
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading || !active) return null;

  return (
    <div
      className={inter.className}
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "6px auto 0",
        padding: "12px 20px",
        borderRadius: 14,
        border: "1px solid rgba(125,108,113,.25)",
        background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.45))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#7D6C71", // même couleur que le titre
        textAlign: "center",
        fontWeight: 500,
        fontVariantNumeric: "lining-nums proportional-nums",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: "1.05rem" }}>
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

  useEffect(() => {
    document.body.classList.toggle("body-public", !isAdmin);
  }, [isAdmin]);

  if (isAdmin) return <main className="site-main">{children}</main>;

  return (
    <div>
      <header className="site-header">
        <div className="header-left" />
        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>
        <div className="header-right">
          <PublicMenuDropdown />
        </div>
      </header>

      {/* ✅ Bannières en dessous du titre, pas dans le header */}
      <div style={{ width: "100%", maxWidth: 900, margin: "0 auto 14px" }}>
        <ClosedBannerInline />
        <PromoBanner />
      </div>

      <main className="site-main">{children}</main>
    </div>
  );
}
