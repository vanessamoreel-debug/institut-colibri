// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

import Menu from "./components/Menu"; // ✅ menu avec fermeture auto
import BannerHost from "./components/BannerHost"; // ✅ centralise les bannières

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

            {/* ✅ Menu déroulant à droite */}
            <Menu />
          </header>

          {/* ======= Contenu ======= */}
          <main className="site-main">
            {/* ✅ Bannières (affichées seulement sur le site public) */}
            <BannerHost />
            {children}
          </main>

          {/* ======= Footer ======= */}
          <footer className="site-footer">Colibri © 2025</footer>
        </div>
      </body>
    </html>
  );
}
