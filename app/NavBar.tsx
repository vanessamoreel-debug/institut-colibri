// /app/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/soins", label: "Soins" },
  { href: "/contact", label: "Contact" },
  { href: "/a-propos", label: "À propos" },
  { href: "/admin", label: "Admin" }, // utile pour toi; on pourra le masquer plus tard
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      {LINKS.map((l) => {
        const isActive =
          l.href === "/"
            ? pathname === "/"
            : pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            className={isActive ? "nav-link active" : "nav-link"}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
