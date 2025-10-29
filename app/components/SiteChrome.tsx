// app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ✅ imports RELATIFS vers app/components/admin/*
import Menu from "./admin/Menu";
import MenuAdmin from "./admin/MenuAdmin";

type Props = { children: React.ReactNode };

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "admin-shell" : undefined}>
      <header className="site-header">
        {/* à gauche : on ne met rien (et en admin c’est masqué via CSS) */}
        <div className="header-left" />

        {/* centre : titre */}
        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>

        {/* droite : menu dropdown (public ou admin) */}
        <div className="header-right">
          {isAdmin ? <MenuAdmin /> : <Menu />}
        </div>
      </header>

      <main className="site-main">{children}</main>
    </div>
  );
}
