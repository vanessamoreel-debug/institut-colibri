// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteChrome from "./components/SiteChrome";
import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";

export const metadata: Metadata = {
  title: "Institut Colibri",
  description: "Soins & bien-être",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen body-public">
        <main className="mx-auto max-w-6xl p-4">
          {/* Bannières globales */}
          <ClosedBanner />
          <PromoBanner />

          {/* En-tête (titre + menu) */}
          <SiteChrome />

          {/* Contenu des pages */}
          {children}

          {/* Footer UNIQUE */}
          <footer className="site-footer">
            <span>© Institut Colibri 2025</span>
          </footer>
        </main>
      </body>
    </html>
  );
}
