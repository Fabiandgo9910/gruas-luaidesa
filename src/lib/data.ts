import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Restaurant, Section, Category, Product } from "@/types";

// Estas funciones alimentan la página PÚBLICA del menú (sin login). Usan el
// cliente de servicio a propósito, igual que el panel /admin: en vez de
// depender de que la política RLS compuesta de "restaurants" (que usa
// funciones auxiliares) se evalúe igual en cada proyecto de Supabase, el
// control de "¿es público?" se hace aquí mismo, en código, de forma
// explícita y siempre igual sin importar el proyecto.

// Busca un restaurante por slug O por dominio propio (custom_domain).
// Solo devuelve el restaurante si está activo (is_active = true) — así
// nunca depende de RLS para decidir si es visible al público.
export async function getRestaurantBySlugOrDomain(
  slugOrHost: string
): Promise<Restaurant | null> {
  const admin = createAdminClient();

  const { data: bySlug } = await admin
    .from("restaurants")
    .select("*")
    .eq("slug", slugOrHost)
    .maybeSingle();

  if (bySlug) return (bySlug as Restaurant).is_active ? (bySlug as Restaurant) : null;

  const { data: byDomain } = await admin
    .from("restaurants")
    .select("*")
    .eq("custom_domain", slugOrHost)
    .maybeSingle();

  if (byDomain) return (byDomain as Restaurant).is_active ? (byDomain as Restaurant) : null;

  return null;
}

export async function getSections(restaurantId: string): Promise<Section[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("sections")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });
  return (data as Section[]) ?? [];
}

export async function getCategories(restaurantId: string): Promise<Category[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });
  return (data as Category[]) ?? [];
}

export async function getProducts(restaurantId: string): Promise<Product[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("products")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });
  return (data as Product[]) ?? [];
}

// Producto individual para la página pública de detalle. Solo devuelve el
// producto si pertenece a un restaurante activo y si el producto está
// publicado (available = true) — igual que en la página del menú.
export async function getPublicProduct(
  restaurantId: string,
  productId: string
): Promise<Product | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("restaurant_id", restaurantId)
    .eq("available", true)
    .maybeSingle();
  return (data as Product) ?? null;
}

export async function getCurrentProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
