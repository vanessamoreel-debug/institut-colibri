export const metadata = { title: "Institut Colibri", description: "Soins & tarifs" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 20, background: "#fafafa" }}>
        <header style={{ maxWidth: 960, margin: "0 auto 20px", padding: "10px 0" }}>
          <h1 style={{ margin: 0 }}>Institut Colibri</h1>
          <p style={{ margin: "6px 0 0", color: "#555" }}>Soins, durées et tarifs</p>
        </header>
        <main style={{ maxWidth: 960, margin: "0 auto" }}>{children}</main>
        <footer style={{ maxWidth: 960, margin: "40px auto 0", fontSize: 12, color: "#777" }}>
          <hr />
          <p>© {new Date().getFullYear()} Institut Colibri</p>
        </footer>
      </body>
    </html>
  );
}
