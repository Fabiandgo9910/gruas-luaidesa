import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase no está configurado. Falta NEXT_PUBLIC_SUPABASE_URL y/o " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local. " +
        "Revisa la sección 3 del README (Configurar el proyecto localmente)."
    );
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // se puede ignorar si se llama desde un Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // se puede ignorar si se llama desde un Server Component
          }
        },
      },
    }
  );
}

// Cliente con permisos totales (service role) - SOLO usar en server, nunca exponer al cliente
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY (o NEXT_PUBLIC_SUPABASE_URL) en tu .env.local. " +
        "Esta clave es necesaria para que el Super Admin pueda crear usuarios."
    );
  }

  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });
}
