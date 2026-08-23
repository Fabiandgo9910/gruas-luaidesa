"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import GeneralForm from "./GeneralForm";
import ThemeEditor from "./ThemeEditor";
import SectionsManager from "./SectionsManager";
import UsersManager from "./UsersManager";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";
import LivePreview from "./LivePreview";
import type { Restaurant, Section, Profile, Category, Product } from "@/types";

// Orden pensado como flujo natural: primero identidad y diseño del
// restaurante, luego el contenido del menú, y al final accesos y vista previa.
const TABS = [
  { id: "general", label: "General" },
  { id: "tema", label: "Diseño y tema" },
  { id: "secciones", label: "Secciones" },
  { id: "productos", label: "Productos" },
  { id: "categorias", label: "Categorías" },
  { id: "usuarios", label: "Usuarios" },
  { id: "preview", label: "Vista previa" },
] as const;

export default function RestaurantEditorTabs({
  restaurant,
  sections,
  owners,
  categories,
  products,
}: {
  restaurant: Restaurant;
  sections: Section[];
  owners: Profile[];
  categories: Category[];
  products: Product[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("general");

  return (
    <div>
      <div
        className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto"
        role="tablist"
        aria-label="Secciones de configuración del restaurante"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm border-b-2 -mb-px whitespace-nowrap",
              tab === t.id
                ? "border-black text-black font-medium"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" && <GeneralForm restaurant={restaurant} />}
      {tab === "tema" && <ThemeEditor restaurant={restaurant} />}
      {tab === "secciones" && <SectionsManager restaurantId={restaurant.id} sections={sections} />}
      {tab === "productos" && (
        <ProductsManager restaurantId={restaurant.id} categories={categories} products={products} />
      )}
      {tab === "categorias" && (
        <CategoriesManager restaurantId={restaurant.id} categories={categories} />
      )}
      {tab === "usuarios" && <UsersManager restaurantId={restaurant.id} owners={owners} />}
      {tab === "preview" && <LivePreview slug={restaurant.slug} isActive={restaurant.is_active} />}
    </div>
  );
}
