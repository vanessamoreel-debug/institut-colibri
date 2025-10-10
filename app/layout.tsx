// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteChrome from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "Institut Colibri",
  description: "Soins & bien-être",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen body-public">
        {/* SiteChrome gère le header, le menu, le footer et enveloppe le contenu */}
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
