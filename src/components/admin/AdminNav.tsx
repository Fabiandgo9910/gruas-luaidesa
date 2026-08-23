"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, ExternalLink, ShieldCheck, Store } from "lucide-react";

export default function AdminNav({
  role,
  restaurantName,
  restaurantSlug,
}: {
  role: "owner" | "super_admin";
  restaurantName?: string;
  restaurantSlug?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const isEditingRestaurant = pathname.startsWith("/admin/restaurantes/");

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-neutral-100 hidden md:flex flex-col p-5">
      <div className="mb-8">
        {role === "super_admin" ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-neutral-400" />
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Super Admin</p>
            </div>
            <p className="font-semibold">Todos los restaurantes</p>
            {isEditingRestaurant && (
              <Link
                href="/admin"
                className="text-xs text-neutral-500 flex items-center gap-1 mt-1 hover:text-black"
              >
                ← Volver a la lista
              </Link>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Store size={16} className="text-neutral-400" />
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Admin de restaurante</p>
            </div>
            <p className="font-semibold truncate">{restaurantName ?? "Sin asignar"}</p>
            {restaurantSlug && (
              <Link
                href={`/${restaurantSlug}`}
                target="_blank"
                className="text-xs text-neutral-500 flex items-center gap-1 mt-1 hover:text-black"
              >
                Ver menú público <ExternalLink size={12} />
              </Link>
            )}
          </>
        )}
      </div>

      <div className="flex-1" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-neutral-500 hover:bg-neutral-100"
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </aside>
  );
}
