import { getEventosContacto } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ETIQUETAS: Record<string, string> = {
  llamada: "Llamada",
  whatsapp: "WhatsApp (grúas)",
  whatsapp_bateria: "WhatsApp (batería)",
  formulario: "Formulario",
};

const COLORES: Record<string, string> = {
  llamada: "border-gold/40 text-gold",
  whatsapp: "border-whatsapp/40 text-whatsapp",
  whatsapp_bateria: "border-whatsapp/40 text-whatsapp",
  formulario: "border-sand-100/30 text-sand-100",
};

export default async function ContactosPage() {
  let eventos;
  let error = "";
  try {
    eventos = await getEventosContacto(300);
  } catch (err) {
    error = err instanceof Error ? err.message : "Error al cargar los contactos.";
  }

  return (
    <div>
      <h1 className="font-condensed text-3xl font-black text-sand-100 uppercase mb-2">Contactos</h1>
      <p className="text-sand-100/40 text-sm mb-8">
        Cada clic en llamar, WhatsApp o envío de formulario, en tiempo real. Últimos 300 registros.
      </p>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 text-red-300 text-sm mb-6">{error}</div>
      )}

      {eventos && eventos.length === 0 && (
        <div className="bg-ink-800 border border-gold/15 rounded-2xl p-10 text-center">
          <p className="text-sand-100/50">Todavía no hay contactos registrados.</p>
        </div>
      )}

      {eventos && eventos.length > 0 && (
        <div className="overflow-x-auto bg-ink-800 border border-gold/15 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-left text-[11px] uppercase tracking-wider text-gold-dark">
                <th className="p-4">Fecha</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Origen</th>
                <th className="p-4">Página</th>
                <th className="p-4">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((ev) => (
                <tr key={ev.id} className="border-b border-sand-100/5 last:border-0">
                  <td className="p-4 text-sand-100/60 whitespace-nowrap">
                    {new Date(ev.created_at).toLocaleString("es-ES")}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${COLORES[ev.tipo] || ""}`}>
                      {ETIQUETAS[ev.tipo] || ev.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-sand-100/60">{ev.origen || "—"}</td>
                  <td className="p-4 text-sand-100/60">{ev.pagina || "—"}</td>
                  <td className="p-4 text-sand-100/60">{ev.detalle || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
