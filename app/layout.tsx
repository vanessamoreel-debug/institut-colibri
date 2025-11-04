// /app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";

export const metadata: Metadata = {
  title: "Institut Colibri",
  description: "Soins & bien-être",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="body-public">
      <body className="min-h-screen">
        {/* Bannières en haut de page */}
        <ClosedBanner />
        <PromoBanner />

        <div className="site">
          <SiteChrome>{children}</SiteChrome>
          <footer className="site-footer">
            <span>© Institut Colibri 2025</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
