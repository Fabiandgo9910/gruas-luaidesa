import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { eliminarBateriasEnLote } from "@/lib/supabase";

// POST /api/admin/baterias/bulk-delete — { ids: string[] }
export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const { ids } = (await req.json()) as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No se han indicado baterías a eliminar." }, { status: 400 });
    }
    await eliminarBateriasEnLote(ids);
    return NextResponse.json({ success: true, eliminadas: ids.length });
  } catch (error) {
    console.error("[API /admin/baterias/bulk-delete] Error:", error);
    return NextResponse.json({ error: "Error al eliminar las baterías seleccionadas." }, { status: 500 });
  }
}
