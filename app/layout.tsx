// /app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "Institut Colibri",
  description: "Soins & bien-être",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="body-public">
      <body className="min-h-screen">
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
