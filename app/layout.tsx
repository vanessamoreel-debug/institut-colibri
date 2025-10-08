// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";
import Menu from "./components/Menu"; // ✅ menu avec fermeture auto

export const metadata: Metadata = {
  title: "INSTITUT COLIBRI",
  description: "Soins & bien-être",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="site">
          {/* ======= Header ======= */}
          <header className="site-header">
            <h1 className="site-title">
              <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                INSTITUT COLIBRI
              </Link>
            </h1>

            {/* ✅ Menu (bouton à droite, se referme tout seul) */}
            <Menu />
          </header>

          {/* ======= Contenu ======= */}
          <main className="site-main">
            <ClosedBanner />
            <PromoBanner />
            {children}
          </main>

          {/* ======= Footer ======= */}
          <footer className="site-footer">Colibri © 2025</footer>
        </div>
      </body>
    </html>
  );
}
