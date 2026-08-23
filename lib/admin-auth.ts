// ============================================================
// Helper de autorización para las API routes de /api/admin/*
// ============================================================
import { NextResponse } from "next/server";
import { getUsuarioAdmin } from "@/lib/supabase-server";

/**
 * Comprueba que hay una sesión de Supabase Auth válida.
 * Devuelve el usuario, o lanza una respuesta 401 ya construida.
 */
export async function requireAdmin() {
  const user = await getUsuarioAdmin();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "No autorizado." }, { status: 401 }),
    };
  }
  return { user, response: null };
}
