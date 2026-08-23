import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { getSections, getCategories, getProducts, getCurrentProfile } from "@/lib/data";
import RestaurantEditorTabs from "@/components/admin/RestaurantEditorTabs";
import DeleteRestaurantButton from "@/components/admin/DeleteRestaurantButton";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Restaurant, Profile } from "@/types";

export default async function RestaurantEditorPage({ params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "super_admin") {
    redirect("/admin");
  }

  // Cliente de servicio: la autorización (super_admin) ya se comprobó
  // arriba con getCurrentProfile(). Igual que en /admin, evitamos depender
  // de la política RLS compuesta de "restaurants" para la lectura.
  const admin = createAdminClient();
  const { data: restaurant } = await admin
    .from("restaurants")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!restaurant) notFound();

  const [sections, categories, products, ownersRes] = await Promise.all([
    getSections(params.id),
    getCategories(params.id),
    getProducts(params.id),
    admin.from("profiles").select("*").eq("restaurant_id", params.id).eq("role", "owner"),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg hover:bg-neutral-100">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
            <Link
              href={`/${restaurant.slug}`}
              target="_blank"
              className="text-xs text-neutral-500 flex items-center gap-1 hover:text-black"
            >
              /{restaurant.slug} <ExternalLink size={12} />
            </Link>
          </div>
        </div>
        <DeleteRestaurantButton id={restaurant.id} name={restaurant.name} />
      </div>

      <RestaurantEditorTabs
        restaurant={restaurant as Restaurant}
        sections={sections}
        owners={(ownersRes.data as Profile[]) ?? []}
        categories={categories}
        products={products}
      />
    </div>
  );
}
