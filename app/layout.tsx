// /app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./NavBar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Institut Colibri",
  description: "Soins, durées et tarifs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="site">
       <header className="site-header">
  <h1 className="site-title">Institut Colibri</h1>
  <NavBar />
</header>

        <main className="site-main">{children}</main>
        <footer className="site-footer card">
  © 2025 Institut Colibri
</footer>
      </body>
    </html>
  );
}
