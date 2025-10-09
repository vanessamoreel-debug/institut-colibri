// /app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteChrome from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "INSTITUT COLIBRI",
  description: "Soins & bien-être",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SiteChrome>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
