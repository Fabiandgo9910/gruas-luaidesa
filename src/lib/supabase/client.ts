import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase no está configurado. Falta NEXT_PUBLIC_SUPABASE_URL y/o " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local. " +
        "Revisa la sección 3 del README (Configurar el proyecto localmente)."
    );
  }

  return createBrowserClient(url, key);
}
