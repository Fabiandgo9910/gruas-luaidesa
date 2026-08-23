import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import {
  getRestaurantBySlugOrDomain,
  getPublicProduct,
  getCategories,
} from "@/lib/data";
import ProductGallery from "@/components/public/ProductGallery";
import { formatPrice } from "@/lib/utils";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: { slug: string; productId: string };
}): Promise<Metadata> {
  const restaurant = await getRestaurantBySlugOrDomain(params.slug);
  if (!restaurant) return {};
  const product = await getPublicProduct(restaurant.id, params.productId);
  if (!product) return {};
  return {
    title: `${product.name} | ${restaurant.name}`,
    description: product.description || restaurant.description,
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  const restaurant = await getRestaurantBySlugOrDomain(params.slug);
  if (!restaurant) notFound();

  const [product, categories] = await Promise.all([
    getPublicProduct(restaurant.id, params.productId),
    getCategories(restaurant.id),
  ]);

  if (!product) notFound();

  const category = categories.find((c) => c.id === product.category_id);
  const images = [product.image_url, ...(product.gallery_images ?? [])].filter(
    (u): u is string => !!u
  );

  return (
    <main className="max-w-2xl mx-auto px-6 py-6 pb-16">
      <Link
        href={`/${restaurant.slug}#menu`}
        className="inline-flex items-center gap-1.5 text-sm text-text/60 hover:text-text mb-5"
      >
        <ChevronLeft size={16} /> Volver al menú
      </Link>

      <ProductGallery images={images} alt={product.name} />

      <div className="mt-6">
        {category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
            {category.name}
          </span>
        )}

        <div className="flex items-start justify-between gap-4 mt-1">
          <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
          <div className="text-right shrink-0">
            {product.is_offer && product.offer_price ? (
              <div>
                <span className="line-through text-sm text-text/40 mr-1">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl font-semibold text-secondary">
                  {formatPrice(product.offer_price)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        {product.description && (
          <p className="text-text/70 mt-3 leading-relaxed">{product.description}</p>
        )}

        {product.ingredients?.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text/50 mb-2">
              Ingredientes
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((ing) => (
                <span key={ing} className="px-2.5 py-1 rounded-full bg-neutral-100 text-sm text-text/70">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.allergens?.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text/50 mb-2">
              Alérgenos
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {product.allergens.map((al) => (
                <span
                  key={al}
                  className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-sm"
                >
                  ⚠ {al}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
