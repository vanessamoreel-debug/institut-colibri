// app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen body-admin">
        {/* Header admin fixe, chic & translucide */}
        <header className="admin-header">
          <div className="admin-header__inner">
            <div className="admin-header__brand">Institut Colibri — Administration</div>
            <nav className="admin-header__nav">
              <a className="nav-link" href="/admin?tab=soins">Soins</a>
              <a className="nav-link" href="/admin?tab=contact">Contact</a>
              <a className="nav-link" href="/admin?tab=a-propos">À&nbsp;propos</a>
              <a className="nav-link" href="/admin?tab=fermeture">Fermeture</a>
              <a className="nav-link" href="/admin?tab=promo">Promo</a>
              <a className="nav-link" href="/">↩ Retour au site</a>
            </nav>
          </div>
        </header>

        {/* Décalage sous le header fixe + container */}
        <main className="admin-main">{children}</main>
      </body>
    </html>
  );
}
