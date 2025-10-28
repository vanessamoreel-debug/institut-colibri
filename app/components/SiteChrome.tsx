// /app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import Menu from "./Menu";

export default function SiteChrome() {
  return (
    <header className="site-header">
      
      {/* Titre cliquable centré */}
      <div className="header-center">
        <Link
          href="/"
          className="site-title-text"
          style={{ textDecoration: "none" }}
        >
          Institut Colibri
        </Link>
      </div>

      {/* Menu à droite */}
      <div className="header-right">
        <Menu />
      </div>

    </header>
  );
}
