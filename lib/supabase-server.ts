// ============================================================
// Cliente de Supabase para el SERVIDOR (Auth con cookies)
// ============================================================
// Usado en Server Components, layouts y API routes del panel de
// administración para saber quién es el usuario autenticado.
// También usa la clave "anon": la sesión (cookie) es la que
// autoriza, no esta clave. Los datos reales se leen/escriben con
// la service_role key en lib/supabase.ts, nunca aquí.

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Revisa tu .env.local (ver .env.local.example)."
    );
  }

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Se llama desde un Server Component sin permiso de escritura;
          // el middleware ya se encarga de refrescar la sesión.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Ver comentario anterior.
        }
      },
    },
  });
}

/** Devuelve el usuario autenticado o null. Uso en Server Components/API routes. */
export async function getUsuarioAdmin() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
