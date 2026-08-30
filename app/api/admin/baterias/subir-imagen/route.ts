import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin, slugify } from "@/lib/supabase";
import { rateLimit, obtenerIp } from "@/lib/rate-limit";

const BUCKET = "baterias-imagenes";
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB

/**
 * Se asegura de que el bucket de Storage exista antes de subir nada.
 * Así el administrador no depende de haberlo creado a mano en el
 * dashboard de Supabase: si falta, la propia app lo crea (público,
 * solo imágenes) la primera vez que se sube una foto.
 */
async function asegurarBucket(supabase: ReturnType<typeof getSupabaseAdmin>) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const existe = buckets?.some((b) => b.name === BUCKET);
  if (existe) return;

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: TAMANO_MAXIMO,
    allowedMimeTypes: TIPOS_PERMITIDOS,
  });

  // Si otra petición lo creó justo a la vez (condición de carrera),
  // Supabase devuelve "already exists" — no es un error real.
  if (createError && !createError.message?.toLowerCase().includes("already exists")) {
    throw createError;
  }
}

// ============================================================
// POST /api/admin/baterias/subir-imagen
// Sube el archivo de imagen directamente al Storage de Supabase
// (bucket público "baterias-imagenes") y devuelve la URL pública
// para guardarla en el campo imagen_url de la batería.
// ============================================================
export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  if (!rateLimit(`subir-imagen:${obtenerIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Demasiadas subidas seguidas. Espera un momento." }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No se ha recibido ningún archivo." }, { status: 400 });
    }
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no admitido. Usa JPG, PNG, WEBP o GIF." },
        { status: 400 }
      );
    }
    if (file.size > TAMANO_MAXIMO) {
      return NextResponse.json({ error: "La imagen no puede superar 5 MB." }, { status: 400 });
    }

    const nombreOriginal = "name" in file ? (file as File).name : "imagen";
    const extension = nombreOriginal.includes(".") ? nombreOriginal.split(".").pop() : "jpg";
    const nombreBase = slugify(nombreOriginal.replace(/\.[^/.]+$/, "")) || "bateria";
    const ruta = `${Date.now()}-${nombreBase}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdmin();

    await asegurarBucket(supabase);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(ruta, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("[API /admin/baterias/subir-imagen] Error:", error);
    const mensaje = error instanceof Error ? error.message : "Error al subir la imagen.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
