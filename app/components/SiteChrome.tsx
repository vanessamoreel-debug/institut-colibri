// app/components/SiteChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ✅ imports absolus (évite les soucis de chemins relatifs)
import Menu from "@/components/admin/Menu";
import MenuAdmin from "@/components/admin/MenuAdmin";

type Props = { children: React.ReactNode };

export default function SiteChrome({ children }: Props) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "admin-shell" : undefined}>
      <header className="site-header">
        {/* côté gauche : rien en admin, (on laisse vide aussi en public pour rester propre) */}
        {!isAdmin && <div className="header-left" />}

        <div className="header-center">
          <Link href="/" className="site-title-text">INSTITUT COLIBRI</Link>
        </div>

        <div className="header-right">
          {isAdmin ? <MenuAdmin /> : <Menu />}
        </div>
      </header>

      <main className="site-main">{children}</main>
    </div>
  );
}
