import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";

export const metadata: Metadata = {
  title: "INSTITUT COLIBRI",
  description: "Institut Colibri – soins & bien-être",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="site">
          {/* ---------- HEADER ---------- */}
          <header className="site-header">
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 className="site-title">INSTITUT COLIBRI</h1>
            </Link>

            {/* Menu simple et toujours visible */}
            <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="menu-link" href="/">Accueil</Link>
              <Link className="menu-link" href="/soins">Soins</Link>
              <Link className="menu-link" href="/contact">Contact</Link>
              <Link className="menu-link" href="/a-propos">À&nbsp;propos</Link>
              <Link className="menu-link" href="/admin">Admin</Link>
            </nav>
          </header>

          {/* ---------- CONTENU ---------- */}
          <main className="site-main">
            {/* Bannières en haut de chaque page */}
            <PromoBanner />
            <ClosedBanner />

            {children}
          </main>

          {/* ---------- FOOTER ---------- */}
          <footer className="site-footer">Colibri © 2025</footer>
        </div>
      </body>
    </html>
  );
}
