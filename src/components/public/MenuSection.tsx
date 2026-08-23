import ProductCard from "./ProductCard";
import type { Category, Product } from "@/types";

export default function MenuSection({
  categories,
  products,
  slug,
}: {
  categories: Category[];
  products: Product[];
  slug: string;
}) {
  const visibleCategories = categories.filter((c) => c.visible);
  const availableProducts = products.filter((p) => p.available);

  const categorizedIds = new Set(visibleCategories.map((c) => c.id));
  // Productos sin categoría, o cuya categoría no existe/está oculta: en vez
  // de desaparecer silenciosamente del menú público, se muestran igual bajo
  // un grupo genérico. Esto es intencional: un producto recién creado (sin
  // categoría asignada todavía) SIEMPRE debe verse en el menú.
  const uncategorized = availableProducts.filter(
    (p) => !p.category_id || !categorizedIds.has(p.category_id)
  );

  const groups = [
    ...visibleCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      items: availableProducts.filter((p) => p.category_id === cat.id),
    })),
    ...(uncategorized.length > 0
      ? [{ id: "mas", name: visibleCategories.length > 0 ? "Más" : "Menú", items: uncategorized }]
      : []),
  ].filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section id="menu">
      {/* Navegación pegajosa de categorías: ayuda a saltar directo a una
          sección en menús largos, patrón habitual en apps de delivery. */}
      {groups.length > 1 && (
        <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-sm border-b border-black/5 mb-2">
          <div className="max-w-2xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
            {groups.map((g) => (
              <a
                key={g.id}
                href={`#grupo-${g.id}`}
                className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-black/10 hover:bg-black/5 whitespace-nowrap"
              >
                {g.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-6">
        <h2 className="text-xl font-semibold mb-6 text-center">Nuestro menú</h2>

        <div className="flex flex-col gap-10">
          {groups.map((g) => (
            <div key={g.id} id={`grupo-${g.id}`} className="scroll-mt-20">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
                {g.name}
              </h3>
              <div>
                {g.items.map((p) => (
                  <ProductCard key={p.id} product={p} slug={slug} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
