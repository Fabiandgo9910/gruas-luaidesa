import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllBaterias, crearBateria, type BateriaInput } from "@/lib/supabase";

// GET /api/admin/baterias — listado completo (publicadas o no) para el panel
export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const baterias = await getAllBaterias();
    return NextResponse.json({ baterias });
  } catch (error) {
    console.error("[API /admin/baterias GET] Error:", error);
    return NextResponse.json({ error: "Error al obtener las baterías." }, { status: 500 });
  }
}

// POST /api/admin/baterias — crear una batería individual
export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = (await req.json()) as BateriaInput;

    if (!body.modelo?.trim()) {
      return NextResponse.json({ error: "El modelo es obligatorio." }, { status: 400 });
    }
    if (!body.imagen_url?.trim()) {
      return NextResponse.json({ error: "La imagen es obligatoria." }, { status: 400 });
    }

    const bateria = await crearBateria({
      modelo: body.modelo,
      marca: body.marca,
      amperaje: body.amperaje ? Number(body.amperaje) : null,
      precio: body.precio ? Number(body.precio) : null,
      start_stop: !!body.start_stop,
      imagen_url: body.imagen_url,
      publicado: body.publicado ?? true,
    });

    return NextResponse.json({ bateria });
  } catch (error) {
    console.error("[API /admin/baterias POST] Error:", error);
    return NextResponse.json({ error: "Error al crear la batería." }, { status: 500 });
  }
}
