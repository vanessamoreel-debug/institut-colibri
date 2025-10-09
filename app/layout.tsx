// /app/layout.tsx
import "./globals.css";
import ClosedBanner from "./components/ClosedBanner";
import PromoBanner from "./components/PromoBanner";

export const metadata = {
  title: "Institut Colibri",
  description: "Soins & bien-être"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen body-public">
        {/* Bannières globales */}
        {/* @ts-expect-error Server Component */}
        <ClosedBanner />
        {/* Promo est client-side */}
        <PromoBanner />

        <main className="mx-auto max-w-6xl p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
