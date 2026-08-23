import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { ChefHat } from "lucide-react";

export default function RecommendedSection({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  const recommended = products.filter((p) => p.is_recommended && p.available);
  if (recommended.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-secondary mb-4 max-w-2xl mx-auto px-6">
        <ChefHat size={16} /> Recomendaciones del chef
      </h2>
      <div className="flex gap-3 overflow-x-auto px-6 pb-2 snap-x snap-mandatory scrollbar-none max-w-2xl mx-auto">
        {recommended.map((p) => (
          <Link
            key={p.id}
            href={`/${slug}/producto/${p.id}`}
            className="group rounded-theme overflow-hidden bg-neutral-50 border border-black/5 shrink-0 w-40 snap-start hover:shadow-md transition-shadow"
          >
            {p.image_url ? (
              <div className="relative w-full h-28 overflow-hidden">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="160px"
                />
              </div>
            ) : (
              <div className="w-full h-28 bg-neutral-100" />
            )}
            <div className="p-3">
              <p className="font-medium text-sm truncate">{p.name}</p>
              <p className="text-xs text-secondary font-semibold">
                {formatPrice(p.offer_price ?? p.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
