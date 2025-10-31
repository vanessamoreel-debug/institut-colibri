export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="admin-shell">
        <header className="admin-header">
          <div className="admin-header-inner">
            <div className="admin-header-title">Institut Colibri — Administration</div>
            <nav className="admin-nav">
              <a className="nav-link" href="/admin?tab=soins">Soins</a>
              <a className="nav-link" href="/admin?tab=contact">Contact</a>
              <a className="nav-link" href="/admin?tab=a-propos">À&nbsp;propos</a>
              <a className="nav-link" href="/admin?tab=fermeture">Fermeture</a>
              <a className="nav-link" href="/admin?tab=promo">Promo</a>
              <a className="nav-link return" href="/">↩ Retour au site</a>
            </nav>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </body>
    </html>
  );
}
