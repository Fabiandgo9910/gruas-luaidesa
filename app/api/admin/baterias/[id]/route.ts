import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { actualizarBateria, eliminarBateria, type BateriaInput } from "@/lib/supabase";
import { revalidarBaterias } from "@/lib/revalidate";

// PATCH /api/admin/baterias/:id — editar campos o alternar publicado
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body = (await req.json()) as Partial<BateriaInput>;

    const patch: Partial<BateriaInput> = { ...body };
    if (body.amperaje !== undefined) patch.amperaje = body.amperaje ? Number(body.amperaje) : null;
    if (body.precio !== undefined) patch.precio = body.precio ? Number(body.precio) : null;

    const bateria = await actualizarBateria(params.id, patch);
    revalidarBaterias();
    return NextResponse.json({ bateria });
  } catch (error) {
    console.error("[API /admin/baterias/:id PATCH] Error:", error);
    return NextResponse.json({ error: "Error al actualizar la batería." }, { status: 500 });
  }
}

// DELETE /api/admin/baterias/:id — eliminar una batería
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await eliminarBateria(params.id);
    revalidarBaterias();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /admin/baterias/:id DELETE] Error:", error);
    return NextResponse.json({ error: "Error al eliminar la batería." }, { status: 500 });
  }
}
