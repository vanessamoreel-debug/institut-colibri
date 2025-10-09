// /app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen body-admin">
        <header className="bg-white/85 backdrop-blur-sm shadow">
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
            <div className="text-xl font-semibold text-[var(--brand)]">Admin — Institut Colibri</div>
            <nav className="flex gap-5">
              <a className="nav-link" href="/admin/soins">Soins</a>
              <a className="nav-link" href="/admin/pages/contact">Contact</a>
              <a className="nav-link" href="/admin/pages/a-propos">À&nbsp;propos</a>
              <a className="nav-link" href="/admin/fermeture">Fermeture</a>
              <a className="nav-link" href="/admin/promo">Promo</a>
              <a className="nav-link" href="/">↩ Retour au site</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
