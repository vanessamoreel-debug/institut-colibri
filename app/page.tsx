// /app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Bienvenue à l’Institut Colibri</h2>
      <p
        style={{
          marginTop: 12,
          fontSize: "18px",
          lineHeight: 1.6,
          maxWidth: "700px",
          margin: "12px auto",
        }}
      >
        Un havre de paix au cœur de votre bien-être 🌸
        Découvrez nos soins visage, nos massages relaxants et nos rituels de beauté.
        Accordez-vous une véritable parenthèse de sérénité ✨
      </p>

      <div style={{ marginTop: 25 }}>
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
  );
}
