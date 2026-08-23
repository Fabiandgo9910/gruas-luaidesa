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
        { label: "Llamadas (clics)", value: resumen.totalLlamadas },
        { label: "WhatsApp grúas (clics)", value: resumen.totalWhatsapp },
        { label: "WhatsApp baterías (clics)", value: resumen.totalWhatsappBaterias },
        { label: "Formularios enviados", value: resumen.totalFormularios },
        { label: "Solicitudes de grúa (leads)", value: resumen.totalLeads },
        { label: "Baterías publicadas", value: `${resumen.totalBateriasPublicadas} / ${resumen.totalBaterias}` },
      ]
    : [];

  return (
    <div>
      <h1 className="font-condensed text-3xl font-black text-sand-100 uppercase mb-2">Resumen</h1>
      <p className="text-sand-100/40 text-sm mb-8">
        Control de llamadas, WhatsApp, formularios y catálogo de baterías.
      </p>

      {errorCarga && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 text-red-300 text-sm mb-8">
          No se pudieron cargar las estadísticas: {errorCarga}
        </div>
      )}

      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {TARJETAS.map((t) => (
            <div key={t.label} className="bg-ink-800 border border-gold/15 rounded-2xl p-6">
              <p className="text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-2">{t.label}</p>
              <p className="font-condensed text-4xl font-black text-sand-100">{t.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/panel-control/baterias"
          className="px-5 py-3 bg-gold hover:bg-gold-light text-ink-900 font-condensed font-bold uppercase text-sm rounded-xl transition-colors"
        >
          Gestionar baterías
        </Link>
        <Link
          href="/panel-control/contactos"
          className="px-5 py-3 border border-gold/30 hover:border-gold text-sand-100 font-condensed font-bold uppercase text-sm rounded-xl transition-colors"
        >
          Ver contactos
        </Link>
      </div>
    </div>
  );
}
