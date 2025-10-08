// /app/page.tsx
import Link from "next/link";
import ClosedBanner from "./components/ClosedBanner"; // ✅ import de la bannière

export default function Home() {
  return (
    <>
      {/* ✅ Bannière “Institut fermé / congés” (automatique si activée dans l’admin) */}
      <ClosedBanner />

      {/* Contenu principal */}
      <div>
        <div className="hero-card" style={{ textAlign: "center" }}>
          <h2>Bienvenue à l’Institut Colibri</h2>
          <p>
            Un havre de paix au cœur de votre bien-être.
            Découvrez nos soins visage, nos massages relaxants et nos rituels de beauté.
            Accordez-vous une véritable parenthèse de sérénité.
          </p>

          <div style={{ marginTop: 18 }}>
            <Link
              href="/soins"
              style={{
                display: "inline-block",
                background: "#111",
                color: "#fff",
                padding: "12px 22px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Découvrir nos soins
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
