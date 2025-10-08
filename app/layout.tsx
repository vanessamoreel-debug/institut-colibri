// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

// Composants bannières (déjà créés précédemment)
import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";

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

            {/* Bouton menu (liste déroulante à droite) */}
            <details className="menu-wrap">
              <summary className="menu-button">
                <span className="menu-icon">☰</span>
                Menu <span className="chevron">⌄</span>
              </summary>
              <nav className="menu-panel">
                <Link href="/"        className="menu-link">Accueil</Link>
                <Link href="/soins"   className="menu-link">Soins</Link>
                <Link href="/contact" className="menu-link">Contact</Link>
                <Link href="/a-propos" className="menu-link">À propos</Link>
                <Link href="/admin"   className="menu-link">Admin</Link>
              </nav>
            </details>
          </header>

          {/* ======= Contenu ======= */}
          <main className="site-main">
            {/* Bannières au-dessus de chaque page */}
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
