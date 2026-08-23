import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import { Sparkles } from "lucide-react";

export default function OffersSection({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  const offers = products.filter((p) => p.is_offer && p.available);
  if (offers.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-6 py-8">
      <div className="rounded-theme bg-secondary/10 border border-secondary/30 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-secondary mb-3">
          <Sparkles size={16} /> Ofertas del día
        </h2>
        {offers.map((p) => (
          <ProductCard key={p.id} product={p} slug={slug} />
        ))}
      </div>
    </section>
  );
}
