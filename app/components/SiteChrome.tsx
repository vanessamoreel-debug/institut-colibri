// /app/components/SiteChrome.tsx
import Link from "next/link";
import Menu from "./Menu";

export default function SiteChrome({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="site">
      {/* HEADER */}
      <header className="site-header">
        <Link
          href="/"
          className="site-title"
          style={{ textDecoration: "none" }}
        >
          Institut Colibri
        </Link>
        <Menu />
      </header>

      {/* CONTENU */}
      <main className="site-main">{children}</main>

      {/* FOOTER */}
      <footer className="site-footer">
        <span>© Institut Colibri 2025</span>
      </footer>
    </div>
  );
}
