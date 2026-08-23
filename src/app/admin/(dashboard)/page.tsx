import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCategories, getProducts } from "@/lib/data";
import { ExternalLink, Settings } from "lucide-react";
import NewRestaurantButton from "@/components/admin/NewRestaurantButton";
import OwnerWorkspace from "@/components/admin/OwnerWorkspace";
import type { Restaurant } from "@/types";

export default async function AdminHomePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null; // el layout ya redirige, esto es solo defensivo

  // -------- Vista del dueño de un restaurante --------
  if (profile.role === "owner") {
    if (!profile.restaurant_id) {
      return (
        <div className="max-w-lg bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="font-medium text-amber-800 mb-2">
            Tu cuenta todavía no tiene un restaurante asignado
          </p>
          <p className="text-sm text-amber-700 mb-3">
            Esto pasa si tu usuario se creó antes de asignarle un restaurante,
            o si se creó directamente desde Supabase en vez de desde este panel.
          </p>
          <p className="text-sm text-amber-700">
            <strong>Solución:</strong> pide al Super Admin que entre a{" "}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded">/admin</code> →
            abra tu restaurante → pestaña <strong>Usuarios</strong> → sección
            "¿Un usuario quedó sin restaurante asignado?" → escriba tu correo
            (<strong>{profile.email}</strong>) y confirme. Luego vuelve a
            iniciar sesión.
          </p>
        </div>
      );
    }

    // Usamos el cliente de servicio (no el de sesión con RLS) para esta
    // lectura a propósito: la autorización real ya se validó arriba, vía
    // getCurrentProfile() (protegido por la política RLS más simple y
    // confiable: "id = auth.uid()"). Esto evita depender de la política RLS
    // más compleja de "restaurants" (que usa funciones auxiliares) para que
    // la app funcione igual sin importar configuraciones particulares de
    // cada proyecto de Supabase.
    const admin = createAdminClient();
    const [{ data: restaurant }, categories, products] = await Promise.all([
      admin.from("restaurants").select("*").eq("id", profile.restaurant_id).maybeSingle(),
      getCategories(profile.restaurant_id),
      getProducts(profile.restaurant_id),
    ]);

    if (!restaurant) {
      return (
        <div className="max-w-lg bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="font-medium text-red-800 mb-2">
            El restaurante asignado a tu cuenta ya no existe
          </p>
          <p className="text-sm text-red-700 mb-3">
            Tu cuenta apunta a un restaurante que fue eliminado (id:{" "}
            <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">
              {profile.restaurant_id}
            </code>
            ).
          </p>
          <p className="text-sm text-red-700">
            <strong>Solución:</strong> pide al Super Admin que cree (o entre
            a) el restaurante correcto y, en la pestaña <strong>Usuarios</strong>,
            use "¿Un usuario quedó sin restaurante asignado?" con tu correo
            (<strong>{profile.email}</strong>) para reasignarte. Luego vuelve
            a iniciar sesión.
          </p>
        </div>
      );
    }

    return (
      <OwnerWorkspace
        restaurant={restaurant as Restaurant}
        categories={categories}
        products={products}
      />
    );
  }

  // -------- Vista del super admin: lista de todos los restaurantes --------
  const admin = createAdminClient();
  const { data: restaurants } = await admin
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Restaurantes</h1>
          <p className="text-neutral-500 text-sm">
            Crea un restaurante nuevo en segundos, sin desplegar nada.
          </p>
        </div>
        <NewRestaurantButton />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
        {(!restaurants || restaurants.length === 0) && (
          <p className="p-6 text-sm text-neutral-400">Aún no hay restaurantes. Crea el primero.</p>
        )}
        {restaurants?.map((r) => (
          <div key={r.id} className="flex items-center gap-4 p-4">
            <div
              className="w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: r.theme?.primaryColor ?? "#111" }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{r.name}</p>
              <p className="text-xs text-neutral-400">
                /{r.slug} {r.custom_domain && `· ${r.custom_domain}`}
                {!r.is_active && <span className="text-red-500"> · inactivo</span>}
              </p>
            </div>
            <Link
              href={`/${r.slug}`}
              target="_blank"
              className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100"
              title="Ver menú público"
            >
              <ExternalLink size={16} />
            </Link>
            <Link
              href={`/admin/restaurantes/${r.id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white text-xs"
            >
              <Settings size={14} /> Gestionar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
