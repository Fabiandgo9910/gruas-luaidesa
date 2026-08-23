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

// ============================================================
// Baterías (tienda)
// ============================================================

export interface Bateria {
  id: string;
  created_at: string;
  updated_at: string;
  modelo: string;
  marca: string | null;
  amperaje: number | null;
  precio: number | null;
  start_stop: boolean;
  imagen_url: string;
  slug: string;
  publicado: boolean;
}

export interface BateriaInput {
  modelo: string;
  marca?: string | null;
  amperaje?: number | null;
  precio?: number | null;
  start_stop?: boolean;
  imagen_url: string;
  publicado?: boolean;
}

/** Genera un slug único a partir de marca+modelo (+ sufijo si hace falta) */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function generarSlugUnico(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  base: string
): Promise<string> {
  const baseSlug = slugify(base) || "bateria";
  let slug = baseSlug;
  let i = 1;
  // Comprueba colisiones y añade sufijo numérico si hace falta
  for (;;) {
    const { data, error } = await supabase
      .from("baterias")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return slug;
    i += 1;
    slug = `${baseSlug}-${i}`;
  }
}

/** Todas las baterías, publicadas o no (uso exclusivo del panel admin) */
export async function getAllBaterias(): Promise<Bateria[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("baterias")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

/** Solo baterías publicadas (uso público, tienda) */
export async function getBateriasPublicadas(): Promise<Bateria[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("baterias")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getBateriaPorSlug(slug: string): Promise<Bateria | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("baterias")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getBateriaPorId(id: string): Promise<Bateria | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("baterias")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function crearBateria(input: BateriaInput): Promise<Bateria> {
  const supabase = getSupabaseAdmin();
  const slug = await generarSlugUnico(supabase, `${input.marca || ""} ${input.modelo}`);
  const { data, error } = await supabase
    .from("baterias")
    .insert({
      modelo: input.modelo.trim(),
      marca: input.marca?.trim() || null,
      amperaje: input.amperaje ?? null,
      precio: input.precio ?? null,
      start_stop: input.start_stop ?? false,
      imagen_url: input.imagen_url.trim(),
      publicado: input.publicado ?? true,
      slug,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarBateria(
  id: string,
  input: Partial<BateriaInput>
): Promise<Bateria> {
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};
  if (input.modelo !== undefined) patch.modelo = input.modelo.trim();
  if (input.marca !== undefined) patch.marca = input.marca?.trim() || null;
  if (input.amperaje !== undefined) patch.amperaje = input.amperaje;
  if (input.precio !== undefined) patch.precio = input.precio;
  if (input.start_stop !== undefined) patch.start_stop = input.start_stop;
  if (input.imagen_url !== undefined) patch.imagen_url = input.imagen_url.trim();
  if (input.publicado !== undefined) patch.publicado = input.publicado;

  const { data, error } = await supabase
    .from("baterias")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarBateria(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("baterias").delete().eq("id", id);
  if (error) throw error;
}

export async function eliminarBateriasEnLote(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("baterias").delete().in("id", ids);
  if (error) throw error;
}

/**
 * Inserta baterías en lote (importación por Excel).
 * Solo `modelo` e `imagen_url` son obligatorios; el resto puede
 * venir vacío. Devuelve cuántas se crearon y los errores por fila.
 */
export async function crearBateriasEnLote(
  items: BateriaInput[]
): Promise<{ creadas: number; errores: { fila: number; motivo: string }[] }> {
  const supabase = getSupabaseAdmin();
  let creadas = 0;
  const errores: { fila: number; motivo: string }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      if (!item.modelo?.trim()) throw new Error("Falta el modelo (obligatorio)");
      if (!item.imagen_url?.trim()) throw new Error("Falta la imagen (obligatorio)");
      const slug = await generarSlugUnico(supabase, `${item.marca || ""} ${item.modelo}`);
      const { error } = await supabase.from("baterias").insert({
        modelo: item.modelo.trim(),
        marca: item.marca?.trim() || null,
        amperaje: item.amperaje ?? null,
        precio: item.precio ?? null,
        start_stop: item.start_stop ?? false,
        imagen_url: item.imagen_url.trim(),
        publicado: item.publicado ?? true,
        slug,
      });
      if (error) throw error;
      creadas += 1;
    } catch (err) {
      errores.push({
        fila: i + 2, // +2: fila 1 es la cabecera del Excel
        motivo: err instanceof Error ? err.message : "Error desconocido",
      });
    }
  }

  return { creadas, errores };
}

// ============================================================
// Eventos de contacto (control de llamadas / WhatsApp / formularios)
// ============================================================

export type TipoEvento = "llamada" | "whatsapp" | "whatsapp_bateria" | "formulario";

export interface EventoContactoInsert {
  tipo: TipoEvento;
  origen?: string;
  pagina?: string;
  detalle?: string;
}

export async function registrarEventoContacto(evento: EventoContactoInsert) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("eventos_contacto").insert({
    tipo: evento.tipo,
    origen: evento.origen || null,
    pagina: evento.pagina || null,
    detalle: evento.detalle || null,
  });
  if (error) throw error;
}

export interface EventoContacto {
  id: string;
  created_at: string;
  tipo: TipoEvento;
  origen: string | null;
  pagina: string | null;
  detalle: string | null;
}

export async function getEventosContacto(limite = 200): Promise<EventoContacto[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eventos_contacto")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) throw error;
  return data || [];
}

export interface ResumenContactos {
  totalLlamadas: number;
  totalWhatsapp: number;
  totalWhatsappBaterias: number;
  totalFormularios: number;
  totalLeads: number;
  totalBaterias: number;
  totalBateriasPublicadas: number;
}

export async function getResumenPanel(): Promise<ResumenContactos> {
  const supabase = getSupabaseAdmin();

  const [
    { count: totalLlamadas },
    { count: totalWhatsapp },
    { count: totalWhatsappBaterias },
    { count: totalFormularios },
    { count: totalLeads },
    { count: totalBaterias },
    { count: totalBateriasPublicadas },
  ] = await Promise.all([
    supabase.from("eventos_contacto").select("id", { count: "exact", head: true }).eq("tipo", "llamada"),
    supabase.from("eventos_contacto").select("id", { count: "exact", head: true }).eq("tipo", "whatsapp"),
    supabase.from("eventos_contacto").select("id", { count: "exact", head: true }).eq("tipo", "whatsapp_bateria"),
    supabase.from("eventos_contacto").select("id", { count: "exact", head: true }).eq("tipo", "formulario"),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("baterias").select("id", { count: "exact", head: true }),
    supabase.from("baterias").select("id", { count: "exact", head: true }).eq("publicado", true),
  ]);

  return {
    totalLlamadas: totalLlamadas || 0,
    totalWhatsapp: totalWhatsapp || 0,
    totalWhatsappBaterias: totalWhatsappBaterias || 0,
    totalFormularios: totalFormularios || 0,
    totalLeads: totalLeads || 0,
    totalBaterias: totalBaterias || 0,
    totalBateriasPublicadas: totalBateriasPublicadas || 0,
  };
}
