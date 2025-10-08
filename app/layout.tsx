// /app/layout.tsx
import "./globals.css";
import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="site">
          {/* ... ton header/menu ... */}
          <main className="site-main">
            {/* ✅ Bannières en haut de toutes les pages */}
            <ClosedBanner />
            <PromoBanner />

            {children}
          </main>
          {/* ... ton footer ... */}
        </div>
      </body>
    </html>
  );
}
