// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteChrome from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "Institut Colibri",
  description: "Institut de beauté - soins visage, massages, bien-être",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="body-public">
      <body className="body-public">
        <div className="site">
          {/* En-tête (titre + menu) */}
          <SiteChrome />

          {/* Contenu des pages */}
          <main className="site-main">{children}</main>

          {/* Footer pastille en bas gauche (non fixe) */}
          <footer className="site-footer">
            <span>© Institut Colibri 2025</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
