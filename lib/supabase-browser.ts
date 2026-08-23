// ============================================================
// Cliente de Supabase para el NAVEGADOR (solo Auth)
// ============================================================
// Usa la clave "anon" (pública por diseño). Se usa exclusivamente
// para el login/recuperación de contraseña del panel de admin.
// NUNCA se usa para leer/escribir tablas: eso siempre pasa por
// las API routes con la service_role key (lib/supabase.ts).

import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Revisa tu .env.local (ver .env.local.example)."
    );
  }

  return createBrowserClient(url, anonKey);
}
