import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "owner" && profile.role !== "super_admin")) {
    redirect("/admin/login");
  }

  let restaurantName: string | undefined;
  let restaurantSlug: string | undefined;
  if (profile.role === "owner" && profile.restaurant_id) {
    // Cliente de servicio: la autorización (este es SU restaurant_id, leído
    // de su propio perfil) ya se comprobó arriba.
    const admin = createAdminClient();
    const { data } = await admin
      .from("restaurants")
      .select("name, slug")
      .eq("id", profile.restaurant_id)
      .maybeSingle();
    restaurantName = data?.name;
    restaurantSlug = data?.slug;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminNav
        role={profile.role}
        restaurantName={restaurantName}
        restaurantSlug={restaurantSlug}
      />
      <div className="flex-1 min-w-0">
        {profile.role === "owner" && !profile.restaurant_id && (
          <div className="bg-amber-50 text-amber-700 text-sm px-6 py-3 border-b border-amber-200">
            Tu usuario aún no tiene un restaurante asignado. Contacta al super admin.
          </div>
        )}
        <div className="p-6 md:p-10 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
