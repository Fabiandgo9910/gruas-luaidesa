import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductCard({
  product,
  slug,
}: {
  product: Product;
  slug: string;
}) {
  if (!product.available) return null;

  return (
    <Link
      href={`/${slug}/producto/${product.id}`}
      className="group flex gap-4 items-center py-4 border-b border-black/5 last:border-b-0 animate-fadeIn hover:bg-black/[0.02] -mx-2 px-2 rounded-theme transition-colors"
    >
      {product.image_url ? (
        <div className="relative w-20 h-20 shrink-0 rounded-theme overflow-hidden bg-neutral-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="80px"
          />
        </div>
      ) : (
        <div className="w-20 h-20 shrink-0 rounded-theme bg-neutral-100" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-medium leading-snug group-hover:underline decoration-1 underline-offset-2">
            {product.name}
          </h3>
          <div className="text-right shrink-0">
            {product.is_offer && product.offer_price ? (
              <div>
                <span className="line-through text-xs text-text/40 mr-1">
                  {formatPrice(product.price)}
                </span>
                <span className="font-semibold text-secondary">
                  {formatPrice(product.offer_price)}
                </span>
              </div>
            ) : (
              <span className="font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-text/60 mt-1 line-clamp-2">{product.description}</p>
        )}

        {(product.ingredients?.length > 0 || product.allergens?.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
            {product.ingredients?.slice(0, 3).map((ing) => (
              <span key={ing} className="px-2 py-0.5 rounded-full bg-neutral-100 text-text/60">
                {ing}
              </span>
            ))}
            {product.allergens?.map((al) => (
              <span
                key={al}
                className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
              >
                ⚠ {al}
              </span>
            ))}
          </div>
        )}
      </div>

      <ChevronRight
        size={18}
        className="text-text/20 shrink-0 group-hover:text-text/50 transition-colors"
      />
    </Link>
  );
}
