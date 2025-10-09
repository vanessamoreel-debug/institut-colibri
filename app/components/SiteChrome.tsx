// /app/components/SiteChrome.tsx
import Link from "next/link";
import PromoBanner from "./PromoBanner";
import ClosedBanner from "./ClosedBanner";
import Menu from "./Menu";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      {/* Header */}
      <header className="site-header">
        <h1 className="site-title">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            INSTITUT COLIBRI
          </Link>
        </h1>
        <Menu />
      </header>

      {/* Contenu */}
      <main className="site-main">
        <ClosedBanner />
        <PromoBanner />
        {children}
      </main>

      {/* Footer */}
      <footer className="site-footer">Colibri © 2025</footer>
    </div>
  );
}
