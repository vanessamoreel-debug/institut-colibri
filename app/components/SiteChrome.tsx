// /app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "./Menu";           // ton menu public qui n’affiche PAS /admin
import ClosedBanner from "../components/ClosedBanner";
import PromoBanner from "../components/PromoBanner";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Sur /admin : pas de header/footer publics, pas de bannières publiques
    return <>{children}</>;
  }

  return (
    <div className="site">
      {/* ======= Header public ======= */}
      <header className="site-header">
        <h1 className="site-title">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            INSTITUT COLIBRI
          </Link>
        </h1>
        <Menu />
      </header>

      {/* ======= Contenu public ======= */}
      <main className="site-main">
        <ClosedBanner />
        <PromoBanner />
        {children}
      </main>

      {/* ======= Footer public ======= */}
      <footer className="site-footer">Colibri © 2025</footer>
    </div>
  );
}
