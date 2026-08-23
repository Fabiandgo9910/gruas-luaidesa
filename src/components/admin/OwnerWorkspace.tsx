"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";
import OfertasResumen from "./OfertasResumen";
import type { Restaurant, Category, Product } from "@/types";

const TABS = [
  { id: "productos", label: "Productos" },
  { id: "categorias", label: "Categorías" },
  { id: "ofertas", label: "Ofertas del día" },
] as const;

export default function OwnerWorkspace({
  restaurant,
  categories,
  products,
}: {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("productos");

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
          <p className="text-neutral-500 text-sm">
            Gestiona tu menú: productos, precios, fotos, ingredientes, alérgenos y ofertas.
          </p>
        </div>
        <Link
          href={`/${restaurant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 shrink-0"
        >
          Ver mi menú público <ExternalLink size={15} />
        </Link>
      </div>

      <div className="flex gap-2 mb-6 border-b border-neutral-200" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm border-b-2 -mb-px",
              tab === t.id
                ? "border-black text-black font-medium"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "productos" && (
        <ProductsManager restaurantId={restaurant.id} categories={categories} products={products} />
      )}
      {tab === "categorias" && (
        <CategoriesManager restaurantId={restaurant.id} categories={categories} />
      )}
      {tab === "ofertas" && <OfertasResumen products={products} />}
    </div>
  );
}
