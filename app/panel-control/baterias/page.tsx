import Link from "next/link";
import { getAllBaterias } from "@/lib/supabase";
import BateriasTabla from "@/components/admin/BateriasTabla";

export const dynamic = "force-dynamic";

export default async function BateriasAdminPage() {
  let baterias;
  let error = "";
  try {
    baterias = await getAllBaterias();
  } catch (err) {
    error = err instanceof Error ? err.message : "Error al cargar las baterías.";
    console.error("[/panel-control/baterias] Error:", err);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-condensed text-3xl font-black text-sand-100 uppercase">Baterías</h1>
          <p className="text-sand-100/40 text-sm">Crea, edita, publica y elimina el catálogo de la tienda.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/panel-control/baterias/importar"
            className="px-4 py-2.5 border border-gold/30 hover:border-gold text-sand-100 font-semibold text-sm rounded-xl transition-colors"
          >
            Importar Excel
          </Link>
          <Link
            href="/panel-control/baterias/nueva"
            className="px-4 py-2.5 bg-gold hover:bg-gold-light text-ink-900 font-condensed font-black uppercase text-sm rounded-xl transition-colors"
          >
            + Nueva batería
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 text-red-300 text-sm mb-6">{error}</div>
      )}

      {baterias && <BateriasTabla baterias={baterias} />}
    </div>
  );
}
