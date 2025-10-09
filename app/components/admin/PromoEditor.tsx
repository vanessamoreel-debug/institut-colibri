// /app/components/admin/PromoEditor.tsx
"use client";
import { useState } from "react";

type Initial = {
  promoActive: boolean;
  promoText: string;
};

export default function PromoEditor({ initial }: { initial: Initial }) {
  const [promoActive, setPromoActive] = useState<boolean>(!!initial.promoActive);
  const [promoText, setPromoText] = useState<string>(initial.promoText ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "err">(null);

  async function save() {
    try {
      setSaving(true);
      setStatus(null);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Schéma simple (utilisé par PromoBanner côté client)
          promoActive,
          promoText,
          // Compat: met aussi l'objet promoBanner
          promoBanner: { enabled: promoActive, message: promoText }
        })
      });
      if (!res.ok) throw new Error("save_failed");
      setStatus("ok");
      // Forcer l’affichage immédiat des nouvelles valeurs dans l’admin
      window.location.reload();
    } catch (e) {
      setStatus("err");
    } finally {
      setSaving(false);
    }
  }

  function clearText() {
    setPromoText("");
  }

  return (
    <div className="card p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--brand)]">Bannière promotionnelle</h1>
        <p className="text-neutral-600">Activez et modifiez le message de la bannière promo.</p>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={promoActive}
          onChange={(e) => setPromoActive(e.target.checked)}
        />
        <span>Afficher la bannière promo</span>
      </label>

      <div>
        <label className="block text-sm">Message</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Ex : -15% sur les soins visage jusqu’au 30/11."
          value={promoText}
          onChange={(e) => setPromoText(e.target.value)}
        />
        <div className="flex gap-3 mt-2">
          <button onClick={clearText} className="px-3 py-1 border rounded">Effacer le message</button>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Si la bannière est activée mais que le message est vide, ton composant client n’affichera rien.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 bg-[var(--brand)] text-white rounded disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      {status === "ok" && <p className="text-emerald-700">Enregistré ✅</p>}
      {status === "err" && <p className="text-red-700">Erreur lors de l’enregistrement.</p>}
    </div>
  );
}
