import Link from "next/link";
import { getResumenPanel } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PanelDashboard() {
  let resumen;
  let errorCarga = "";
  try {
    resumen = await getResumenPanel();
  } catch (err) {
    errorCarga = err instanceof Error ? err.message : "Error al cargar los datos.";
  }

  const TARJETAS = resumen
    ? [
        { label: "Solicitudes de grúa (leads)", value: resumen.totalLeads },
        { label: "Baterías en catálogo", value: resumen.totalBaterias },
        { label: "Baterías publicadas", value: resumen.totalBateriasPublicadas },
      ]
    : [];

  return (
    <div>
      <h1 className="font-condensed text-3xl font-black text-sand-100 uppercase mb-2">Resumen</h1>
      <p className="text-sand-100/40 text-sm mb-8">
        Estado del catálogo de baterías y de las solicitudes de grúa recibidas. Las llamadas y clics de
        WhatsApp se miden en Google Analytics.
      </p>

      {errorCarga && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 text-red-300 text-sm mb-8">
          No se pudieron cargar las estadísticas: {errorCarga}
        </div>
      )}

      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {TARJETAS.map((t) => (
            <div key={t.label} className="bg-ink-800 border border-gold/15 rounded-2xl p-6">
              <p className="text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-2">{t.label}</p>
              <p className="font-condensed text-4xl font-black text-sand-100">{t.value}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/panel-control/baterias"
        className="inline-block px-5 py-3 bg-gold hover:bg-gold-light text-ink-900 font-condensed font-bold uppercase text-sm rounded-xl transition-colors"
      >
        Gestionar baterías
      </Link>
    </div>
  );
}
