"use client";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/panel-control/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-semibold text-sand-100/50 hover:text-gold border border-sand-100/15 hover:border-gold/40 rounded-full px-4 py-2 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
