// ============================================================
// Grúas Luaidesa — Cliente Supabase (SOLO servidor)
// ============================================================
// Usa la Service Role Key, que tiene permisos totales y bypasea RLS.
// Por eso este archivo NUNCA debe importarse desde un componente
// "use client" ni exponerse al navegador.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Devuelve un cliente de Supabase listo para usar en API routes.
 * Lanza un error claro si faltan las variables de entorno, en vez
 * de fallar de forma silenciosa o ambigua.
 */
export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. " +
        "Revisa tu archivo .env.local (ver .env.local.example)."
    );
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export interface LeadInsert {
  nombre: string;
  telefono: string;
  email?: string;
  ciudad: string;
  servicio: string;
  mensaje?: string;
  origen?: string;
  source_url?: string;
  referrer?: string;
  user_agent?: string;
  ip?: string;
}

/**
 * Inserta un nuevo lead en la tabla `leads` de Supabase.
 */
export async function saveLead(lead: LeadInsert) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      nombre: lead.nombre,
      telefono: lead.telefono,
      email: lead.email || null,
      ciudad: lead.ciudad,
      servicio: lead.servicio,
      mensaje: lead.mensaje || null,
      origen: lead.origen || null,
      source_url: lead.source_url || null,
      referrer: lead.referrer || null,
      user_agent: lead.user_agent || null,
      ip: lead.ip || null,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
