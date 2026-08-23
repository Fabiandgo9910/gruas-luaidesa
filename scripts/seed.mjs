/**
 * Script de seed: crea un restaurante demo con categorías y productos de ejemplo.
 * Uso:
 *   1. Configura tu .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 *   2. Ejecuta: npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log("Creando restaurante demo...");

  const { data: restaurant, error: rError } = await supabase
    .from("restaurants")
    .upsert(
      {
        slug: "demo",
        name: "Restaurante Demo",
        description: "Cocina de autor con ingredientes frescos de temporada.",
        meta_title: "Restaurante Demo | Menú",
        meta_description: "Descubre nuestro menú, ofertas del día y recomendaciones.",
        address: "Calle Falsa 123, Madrid",
        schedule: "Lun-Dom 12:00 - 23:30",
        socials: { instagram: "", facebook: "", whatsapp: "", website: "" },
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (rError) throw rError;
  const restaurantId = restaurant.id;

  console.log("Creando secciones por defecto...");
  await supabase.from("sections").delete().eq("restaurant_id", restaurantId);
  await supabase.from("sections").insert([
    { restaurant_id: restaurantId, type: "hero", title: "Restaurante Demo", sort_order: 0 },
    { restaurant_id: restaurantId, type: "offers", title: "Ofertas del día", sort_order: 1 },
    { restaurant_id: restaurantId, type: "recommended", title: "Recomendaciones", sort_order: 2 },
    { restaurant_id: restaurantId, type: "categories", title: "Nuestro menú", sort_order: 3 },
    { restaurant_id: restaurantId, type: "contact", title: "Contacto y reservas", sort_order: 4, content: { phone: "+34600000000" } },
  ]);

  console.log("Creando categorías...");
  const categoryNames = ["Entrantes", "Platos principales", "Postres", "Bebidas"];
  const { data: categories } = await supabase
    .from("categories")
    .insert(categoryNames.map((name, i) => ({ restaurant_id: restaurantId, name, sort_order: i })))
    .select();

  console.log("Creando productos de ejemplo...");
  const products = [
    { name: "Croquetas de jamón", category: "Entrantes", price: 8.5, description: "Croquetas artesanales de jamón ibérico.", is_recommended: true, ingredients: ["Jamón", "Leche", "Harina"], allergens: ["Gluten", "Lácteos"] },
    { name: "Ensalada César", category: "Entrantes", price: 9.9, description: "Con pollo a la parrilla y aderezo casero.", ingredients: ["Lechuga", "Pollo", "Parmesano"], allergens: ["Lácteos", "Huevos"] },
    { name: "Solomillo a la parrilla", category: "Platos principales", price: 18.5, offer_price: 15.9, is_offer: true, description: "Con guarnición de patatas y pimientos.", ingredients: ["Ternera", "Patata"], allergens: [] },
    { name: "Risotto de setas", category: "Platos principales", price: 14.0, is_recommended: true, description: "Cremoso risotto con setas de temporada.", ingredients: ["Arroz", "Setas", "Parmesano"], allergens: ["Lácteos"] },
    { name: "Tarta de queso", category: "Postres", price: 6.5, description: "Receta tradicional al horno.", ingredients: ["Queso", "Huevo", "Azúcar"], allergens: ["Lácteos", "Huevos"] },
    { name: "Limonada casera", category: "Bebidas", price: 3.5, description: "Limón fresco y hierbabuena.", ingredients: ["Limón", "Agua", "Menta"], allergens: [] },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.name === p.category);
    await supabase.from("products").insert({
      restaurant_id: restaurantId,
      category_id: category?.id ?? null,
      name: p.name,
      description: p.description,
      price: p.price,
      offer_price: p.offer_price ?? null,
      is_offer: p.is_offer ?? false,
      is_recommended: p.is_recommended ?? false,
      available: true,
      ingredients: p.ingredients,
      allergens: p.allergens,
    });
  }

  console.log("✅ Listo. Visita /demo para ver el resultado.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
