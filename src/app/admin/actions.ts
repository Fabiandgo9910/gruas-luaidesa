"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { slugifyBasic } from "@/lib/utils";

/**
 * Autoriza que el usuario actual pueda gestionar el restaurante `restaurantId`.
 * - super_admin: puede gestionar CUALQUIER restaurante.
 * - owner: solo puede gestionar el restaurante que tiene asignado.
 *
 * Esta comprobación usa `getCurrentProfile()`, que lee la fila de "profiles"
 * del propio usuario (protegida por la política RLS más simple que existe:
 * "id = auth.uid()"). Es la única fuente de verdad de autorización en esta
 * app: TODAS las operaciones de escritura de abajo se ejecutan con el
 * cliente de servicio (service role) *después* de pasar por aquí, en vez de
 * depender de que las políticas RLS más complejas (las que dependen de
 * funciones auxiliares como current_user_restaurant_id()) se evalúen bien en
 * cada proyecto de Supabase. Esto hace la app resistente a diferencias de
 * configuración entre proyectos, sin bajar la seguridad: nadie puede
 * ejecutar estas funciones sin pasar primero por esta comprobación.
 */
async function authorizeRestaurant(restaurantId: string) {
  if (!restaurantId) {
    throw new Error(
      "Falta el ID del restaurante (restaurantId vacío al llamar la acción). Esto es un bug: recarga la página e inténtalo de nuevo."
    );
  }
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error(
      "No se pudo leer tu sesión (perfil no encontrado). Cierra sesión y vuelve a entrar."
    );
  }
  if (profile.role === "super_admin") return profile;
  if (profile.role === "owner" && profile.restaurant_id === restaurantId) return profile;
  throw new Error(
    `No autorizado: tu cuenta (rol "${profile.role}", restaurante asignado "${profile.restaurant_id ?? "ninguno"}") no coincide con el restaurante que intentas editar ("${restaurantId}").`
  );
}

async function requireSuperAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("No autenticado. Vuelve a iniciar sesión.");
  if (profile.role !== "super_admin") throw new Error("No autorizado (se requiere super admin).");
  return profile;
}

function revalidateRestaurant(restaurantId: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/restaurantes/${restaurantId}`);
}

// ============================================================
//  PRODUCTOS (owner: solo su restaurante · super_admin: cualquiera)
// ============================================================
export async function upsertProduct(formData: FormData) {
  const restaurantId = String(formData.get("restaurant_id") || "");
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();

  const id = formData.get("id") as string | null;

  const payload = {
    restaurant_id: restaurantId,
    category_id: (formData.get("category_id") as string) || null,
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    offer_price: formData.get("offer_price") ? Number(formData.get("offer_price")) : null,
    is_offer: formData.get("is_offer") === "on",
    is_recommended: formData.get("is_recommended") === "on",
    available: formData.get("available") === "on",
    image_url: (formData.get("image_url") as string) || null,
    gallery_images: (() => {
      try {
        const raw = String(formData.get("gallery_images") || "[]");
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string" && s) : [];
      } catch {
        return [];
      }
    })(),
    ingredients: String(formData.get("ingredients") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    allergens: formData.getAll("allergens") as string[],
  };

  if (id) {
    const { error } = await admin.from("products").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("products").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidateRestaurant(restaurantId);
}

export async function deleteProduct(id: string, restaurantId: string) {
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(restaurantId);
}

export async function toggleProductField(
  id: string,
  restaurantId: string,
  field: "is_offer" | "available" | "is_recommended",
  value: boolean
) {
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();
  const { error } = await admin.from("products").update({ [field]: value }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(restaurantId);
}

// ============================================================
//  CATEGORÍAS
// ============================================================
export async function upsertCategory(formData: FormData) {
  const restaurantId = String(formData.get("restaurant_id") || "");
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();

  const id = formData.get("id") as string | null;
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    throw new Error("El nombre de la categoría no puede estar vacío.");
  }

  const payload = { restaurant_id: restaurantId, name };

  if (id) {
    const { error } = await admin.from("categories").update(payload).eq("id", id);
    if (error) {
      console.error("[upsertCategory] update error:", error);
      throw new Error(`No se pudo actualizar la categoría: ${error.message} (código: ${error.code ?? "?"})`);
    }
  } else {
    const { error } = await admin.from("categories").insert(payload);
    if (error) {
      console.error("[upsertCategory] insert error:", error);
      throw new Error(`No se pudo crear la categoría: ${error.message} (código: ${error.code ?? "?"})`);
    }
  }
  revalidateRestaurant(restaurantId);
}

export async function deleteCategory(id: string, restaurantId: string) {
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(restaurantId);
}

export async function reorderCategory(id: string, restaurantId: string, sort_order: number) {
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();
  const { error } = await admin.from("categories").update({ sort_order }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(restaurantId);
}

export async function toggleCategoryVisible(id: string, restaurantId: string, visible: boolean) {
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();
  const { error } = await admin.from("categories").update({ visible }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(restaurantId);
}

// ============================================================
//  SUBIDA DE IMÁGENES (productos, logos, favicon, portada...)
// ============================================================
export async function uploadImageToStorage(base64: string, path: string, restaurantId: string) {
  await authorizeRestaurant(restaurantId);
  const admin = createAdminClient();
  const buffer = Buffer.from(base64.split(",")[1], "base64");
  const contentType = base64.substring(base64.indexOf(":") + 1, base64.indexOf(";"));

  const { error } = await admin.storage
    .from("restaurant-assets")
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("restaurant-assets").getPublicUrl(path);
  return data.publicUrl;
}

// ============================================================
//  RESTAURANTES (solo super_admin)
// ============================================================
export async function createRestaurant(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const name = String(formData.get("name") || "");
  let slug = String(formData.get("slug") || "") || slugifyBasic(name);
  slug = slugifyBasic(slug);

  const { data, error } = await admin
    .from("restaurants")
    .insert({ name, slug })
    .select()
    .single();
  if (error) throw new Error(error.message);

  const defaultSections = [
    { type: "hero", title: name, subtitle: "", sort_order: 0 },
    { type: "offers", title: "Ofertas del día", sort_order: 1 },
    { type: "recommended", title: "Recomendaciones", sort_order: 2 },
    { type: "categories", title: "Nuestro menú", sort_order: 3 },
    { type: "contact", title: "Contacto y reservas", sort_order: 4 },
  ];
  await admin
    .from("sections")
    .insert(defaultSections.map((s) => ({ ...s, restaurant_id: data.id })));

  revalidatePath("/admin");
  return data.id as string;
}

export async function updateRestaurantGeneral(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  const id = String(formData.get("id"));

  const payload = {
    name: String(formData.get("name") || ""),
    slug: slugifyBasic(String(formData.get("slug") || "")),
    custom_domain: String(formData.get("custom_domain") || "") || null,
    description: String(formData.get("description") || ""),
    meta_title: String(formData.get("meta_title") || ""),
    meta_description: String(formData.get("meta_description") || ""),
    address: String(formData.get("address") || ""),
    schedule: String(formData.get("schedule") || ""),
    logo_url: String(formData.get("logo_url") || "") || null,
    favicon_url: String(formData.get("favicon_url") || "") || null,
    cover_url: String(formData.get("cover_url") || "") || null,
    is_active: formData.get("is_active") === "on",
    socials: {
      instagram: String(formData.get("instagram") || ""),
      facebook: String(formData.get("facebook") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      website: String(formData.get("website") || ""),
    },
  };

  const { error } = await admin.from("restaurants").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(id);
  revalidatePath(`/${payload.slug}`);
}

export async function updateRestaurantTheme(id: string, theme: Record<string, string>) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("restaurants").update({ theme }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(id);
}

export async function deleteRestaurant(id: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("restaurants").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// ============================================================
//  SECCIONES (solo super_admin)
// ============================================================
export async function addSection(restaurantId: string, type: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("sections")
    .select("sort_order")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const { error } = await admin.from("sections").insert({
    restaurant_id: restaurantId,
    type,
    title: "",
    subtitle: "",
    content: {},
    sort_order: nextOrder,
  });
  if (error) throw new Error(error.message);
  revalidateRestaurant(restaurantId);
}

export async function updateSection(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  const id = String(formData.get("id"));
  const restaurantId = String(formData.get("restaurant_id"));

  const payload = {
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    content: JSON.parse(String(formData.get("content") || "{}")),
  };

  const { error } = await admin.from("sections").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateRestaurant(restaurantId);
}

export async function toggleSectionVisible(id: string, restaurantId: string, visible: boolean) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  await admin.from("sections").update({ visible }).eq("id", id);
  revalidateRestaurant(restaurantId);
}

export async function reorderSection(id: string, sort_order: number, restaurantId: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  await admin.from("sections").update({ sort_order }).eq("id", id);
  revalidateRestaurant(restaurantId);
}

export async function deleteSection(id: string, restaurantId: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();
  await admin.from("sections").delete().eq("id", id);
  revalidateRestaurant(restaurantId);
}

// ============================================================
//  USUARIOS (solo super_admin)
// ============================================================
export async function createOwnerUser(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const restaurantId = String(formData.get("restaurant_id") || "");
  const fullName = String(formData.get("full_name") || "");

  if (!restaurantId) {
    throw new Error("Falta el restaurante al que asignar este usuario.");
  }

  const { data: restaurantExists } = await admin
    .from("restaurants")
    .select("id")
    .eq("id", restaurantId)
    .maybeSingle();
  if (!restaurantExists) {
    throw new Error(
      "Ese restaurante ya no existe (puede haber sido eliminado). Recarga la página e inténtalo de nuevo."
    );
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(error.message);

  const { data: savedProfile, error: profileError } = await admin
    .from("profiles")
    .upsert(
      {
        id: data.user.id,
        email,
        role: "owner",
        restaurant_id: restaurantId,
        full_name: fullName,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (profileError) throw new Error(profileError.message);

  if (!savedProfile || savedProfile.restaurant_id !== restaurantId) {
    throw new Error(
      "El usuario se creó pero no se pudo asignar al restaurante. Vuelve a intentarlo."
    );
  }

  revalidateRestaurant(restaurantId);
}

/**
 * Reasigna (o corrige) el restaurante de un usuario existente buscándolo por
 * correo. Sirve tanto para arreglar cuentas que quedaron sin restaurante
 * (por ejemplo si se crearon directo desde Supabase) como para mover a un
 * encargado de un restaurante a otro.
 */
export async function reassignOwnerRestaurant(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const restaurantId = String(formData.get("restaurant_id") || "");
  if (!email || !restaurantId) throw new Error("Faltan datos.");

  const { data: restaurantExists } = await admin
    .from("restaurants")
    .select("id")
    .eq("id", restaurantId)
    .maybeSingle();
  if (!restaurantExists) {
    throw new Error(
      "Ese restaurante ya no existe (puede haber sido eliminado). Recarga la página e inténtalo de nuevo."
    );
  }

  const { data: profile, error: findError } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (findError) throw new Error(findError.message);
  if (!profile) {
    throw new Error(
      `No existe ningún usuario con el correo ${email}. Créalo primero con "Crear nuevo acceso".`
    );
  }

  const { data: updatedProfile, error: updateError } = await admin
    .from("profiles")
    .update({ role: "owner", restaurant_id: restaurantId })
    .eq("id", profile.id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  if (!updatedProfile || updatedProfile.restaurant_id !== restaurantId) {
    throw new Error("No se pudo confirmar la asignación. Vuelve a intentarlo.");
  }

  revalidateRestaurant(restaurantId);
}
