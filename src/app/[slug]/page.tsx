import { notFound } from "next/navigation";
import {
  getRestaurantBySlugOrDomain,
  getSections,
  getCategories,
  getProducts,
} from "@/lib/data";
import Banner from "@/components/public/Banner";
import Footer from "@/components/public/Footer";
import MenuSection from "@/components/public/MenuSection";
import OffersSection from "@/components/public/OffersSection";
import RecommendedSection from "@/components/public/RecommendedSection";
import DailyMenuSection from "@/components/public/DailyMenuSection";
import { TextSection, GallerySection, ContactSection } from "@/components/public/ExtraSections";
import { UtensilsCrossed } from "lucide-react";

export const revalidate = 30; // ISR: refresca cada 30s para reflejar cambios del admin

export default async function RestaurantPublicPage({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await getRestaurantBySlugOrDomain(params.slug);
  if (!restaurant) notFound();

  const [sections, categories, products] = await Promise.all([
    getSections(restaurant.id),
    getCategories(restaurant.id),
    getProducts(restaurant.id),
  ]);

  const heroSection = sections.find((s) => s.type === "hero");
  const visibleSections = sections
    .filter((s) => s.visible && s.type !== "hero")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <Banner restaurant={restaurant} hero={heroSection} />

      <main className="pb-16">
        {products.length === 0 && categories.length === 0 && (
          <div className="max-w-md mx-auto px-6 py-14 text-center text-text/70">
            <UtensilsCrossed size={28} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium text-text mb-1">Este menú todavía no tiene productos</p>
            <p className="text-sm">
              El dueño del restaurante puede añadirlos desde su panel en{" "}
              <code className="bg-black/5 px-1.5 py-0.5 rounded">/admin</code>.
            </p>
          </div>
        )}

        {visibleSections.length > 0
          ? visibleSections.map((section) => {
              switch (section.type) {
                case "offers":
                  return <OffersSection key={section.id} products={products} slug={restaurant.slug} />;
                case "recommended":
                  return (
                    <RecommendedSection key={section.id} products={products} slug={restaurant.slug} />
                  );
                case "daily_menu":
                  return <DailyMenuSection key={section.id} section={section} />;
                case "categories":
                  return (
                    <MenuSection
                      key={section.id}
                      categories={categories}
                      products={products}
                      slug={restaurant.slug}
                    />
                  );
                case "text":
                  return <TextSection key={section.id} section={section} />;
                case "gallery":
                  return <GallerySection key={section.id} section={section} />;
                case "contact":
                  return <ContactSection key={section.id} section={section} />;
                default:
                  return null;
              }
            })
          : (
            // Fallback si el restaurante aún no configuró secciones: orden por defecto
            <>
              <OffersSection products={products} slug={restaurant.slug} />
              <RecommendedSection products={products} slug={restaurant.slug} />
              <MenuSection categories={categories} products={products} slug={restaurant.slug} />
            </>
          )}
      </main>

      <Footer restaurant={restaurant} />
    </>
  );
}
