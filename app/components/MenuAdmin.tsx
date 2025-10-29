// app/components/MenuAdmin.tsx
"use client";

import { useState } from "react";

type Tab = "dashboard" | "services" | "categories" | "pages" | "settings";

/**
 * Props rendues optionnelles pour éviter l'erreur :
 * "Type '{}' is missing the following properties from type '{ tab: Tab; setTab: ... }'"
 */
type Props = {
  tab?: Tab;
  setTab?: (t: Tab) => void;
};

/**
 * Composant menu admin (dropdown).
 * - Si on ne fournit PAS tab/setTab, il gère son propre state en interne.
 * - Si on les fournit, il se comporte en composant contrôlé.
 */
export default function MenuAdmin({ tab, setTab }: Props) {
  // État interne de secours (si les props ne sont pas passées)
  const [internalTab, setInternalTab] = useState<Tab>(tab ?? "dashboard");

  // Sources unifiées : toujours utiliser currentTab / onSetTab dans le JSX ci-dessous
  const currentTab = tab ?? internalTab;
  const onSetTab = setTab ?? setInternalTab;

  // ----- UI du menu admin (dropdown) -----
  // NOTE : adapte les items si tu as une liste différente
  const items: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "services", label: "Soins" },
    { key: "categories", label: "Catégories" },
    { key: "pages", label: "Pages" },
    { key: "settings", label: "Réglages" },
  ];

  return (
    <div className="menu-wrap">
      {/* Bouton du menu admin (même look que le public) */}
      <button className="menu-button" aria-haspopup="true" aria-expanded="false">
        Admin
      </button>

      {/* Panneau déroulant (mêmes styles “carte” que le reste via globals.css) */}
      <div className="menu-panel open" role="menu">
        {items.map((it) => (
          <a
            key={it.key}
            role="menuitem"
            className={`menu-link${currentTab === it.key ? " active" : ""}`}
            href={
              // Ajuste les href selon tes routes admin
              it.key === "dashboard"
                ? "/admin"
                : it.key === "services"
                ? "/admin/soins"
                : it.key === "categories"
                ? "/admin/categories"
                : it.key === "pages"
                ? "/admin/pages"
                : "/admin/settings"
            }
            onClick={(e) => {
              // Si composant "contrôlé", onSetTab changera l'onglet.
              // Les href restent, mais onSetTab sert si tu interceptes la nav ailleurs.
              onSetTab(it.key);
            }}
          >
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );
}
