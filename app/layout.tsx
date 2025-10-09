// /app/layout.tsx
import "./globals.css";
import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";
import type { ReactNode } from "react";

export const metadata = {
  title: "Institut Colibri",
  description: "Soins & bien-être",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen body-public">
        {/* Bannières globales (ClosedBanner est un Server Component, PromoBanner un Client Component) */}
        <ClosedBanner />
        <PromoBanner />

        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
