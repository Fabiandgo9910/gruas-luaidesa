import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireAdmin } from "@/lib/admin-auth";
import { crearBateriasEnLote, type BateriaInput } from "@/lib/supabase";

// ============================================================
// POST /api/admin/baterias/importar
// Recibe un archivo Excel (multipart/form-data, campo "file") y
// crea una batería por cada fila. Solo "modelo" e "imagen" (URL)
// son obligatorios; el resto puede venir vacío.
//
// Cabeceras aceptadas (no distingue mayúsculas/acentos):
//   modelo | marca | precio | amperaje | imagen / imagen_url / url_imagen
//   start_stop / arranque_parada / stop_start  (si/no, true/false, 1/0)
// ============================================================

function normalizarCabecera(h: string): string {
  return h
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

function parseBooleano(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  const s = v.toString().trim().toLowerCase();
  return ["si", "sí", "true", "1", "x", "yes"].includes(s);
}

function parseNumero(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v.toString().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No se ha recibido ningún archivo." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const primeraHoja = workbook.SheetNames[0];
    if (!primeraHoja) {
      return NextResponse.json({ error: "El Excel no tiene ninguna hoja." }, { status: 400 });
    }

    const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[primeraHoja],
      { defval: "" }
    );

    if (filas.length === 0) {
      return NextResponse.json({ error: "El Excel no contiene filas de datos." }, { status: 400 });
    }

    const items: BateriaInput[] = filas.map((filaOriginal: Record<string, unknown>) => {
      const fila: Record<string, unknown> = {};
      for (const key of Object.keys(filaOriginal)) {
        fila[normalizarCabecera(key)] = filaOriginal[key];
      }

      const imagen =
        (fila["imagen"] as string) ||
        (fila["imagen_url"] as string) ||
        (fila["url_imagen"] as string) ||
        (fila["foto"] as string) ||
        "";

      const startStop =
        fila["start_stop"] ?? fila["arranque_parada"] ?? fila["stop_start"] ?? fila["start-stop"];

      return {
        modelo: (fila["modelo"] as string)?.toString() || "",
        marca: (fila["marca"] as string)?.toString() || null,
        precio: parseNumero(fila["precio"]),
        amperaje: parseNumero(fila["amperaje"] ?? fila["ah"]),
        imagen_url: imagen.toString(),
        start_stop: parseBooleano(startStop),
        publicado: true,
      };
    });

    const resultado = await crearBateriasEnLote(items);

    return NextResponse.json({
      total: items.length,
      creadas: resultado.creadas,
      errores: resultado.errores,
    });
  } catch (error) {
    console.error("[API /admin/baterias/importar] Error:", error);
    return NextResponse.json(
      { error: "No se pudo procesar el archivo. Comprueba que sea un .xlsx válido." },
      { status: 500 }
    );
  }
}
