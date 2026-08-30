"use client";
import { useState } from "react";
import { IconClose, IconWhatsApp } from "@/components/icons";
import { trackWhatsAppBateria } from "@/lib/analytics";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";

const inputClass =
  "w-full bg-white border border-ink-900/15 rounded-xl px-4 py-3 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:border-gold text-sm";
const labelClass = "block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1.5";

const OPCIONES_START_STOP = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "no_se", label: "No lo sé" },
];

export default function CocheBateriaModal() {
  const [abierto, setAbierto] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [matricula, setMatricula] = useState("");
  const [startStop, setStartStop] = useState("no_se");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();

    const startStopTexto =
      OPCIONES_START_STOP.find((o) => o.value === startStop)?.label || "No lo sé";

    const partes = [
      `Hola, quiero saber qué batería lleva mi coche: ${marca} ${modelo}${anio ? ` (${anio})` : ""}.`,
      matricula ? `Matrícula: ${matricula}.` : "",
      `¿Sistema Start-Stop?: ${startStopTexto}.`,
    ].filter(Boolean);

    const mensaje = encodeURIComponent(partes.join(" "));

    trackWhatsAppBateria(`consulta_coche:${marca} ${modelo} ${anio} ${matricula}`.trim());
    window.open(`https://wa.me/${WA}?text=${mensaje}`, "_blank", "noopener,noreferrer");
    setAbierto(false);
    setMarca("");
    setModelo("");
    setAnio("");
    setMatricula("");
    setStartStop("no_se");
  };

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="inline-flex items-center justify-center gap-2 border-2 border-gold/30 hover:border-gold text-sand-100 font-condensed font-black uppercase tracking-wide rounded-full px-6 py-3.5 transition-all text-sm sm:text-base"
      >
        ¿No sabes qué batería lleva tu coche?
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-900/80 backdrop-blur-sm px-5 py-8 overflow-y-auto"
          onClick={() => setAbierto(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-light rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-panel my-auto"
          >
            <button
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-ink-900/40 hover:text-ink-900"
            >
              <IconClose className="w-5 h-5" />
            </button>
            <h3 className="font-condensed font-black text-2xl uppercase text-ink-900 mb-2">
              ¿Qué batería lleva tu coche?
            </h3>
            <p className="text-ink-700/60 text-sm mb-6">
              Cuéntanos sobre tu vehículo y te decimos por WhatsApp la batería exacta y el precio.
            </p>
            <form onSubmit={enviar} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Marca *</label>
                  <input
                    required value={marca} onChange={(e) => setMarca(e.target.value)}
                    placeholder="Seat, Renault..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Modelo *</label>
                  <input
                    required value={modelo} onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ibiza, Clio..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Año</label>
                  <input
                    value={anio} onChange={(e) => setAnio(e.target.value)}
                    placeholder="Opcional"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Matrícula</label>
                  <input
                    value={matricula} onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                    placeholder="Opcional"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>¿Tu coche tiene sistema Start-Stop?</label>
                <div className="grid grid-cols-3 gap-2">
                  {OPCIONES_START_STOP.map((op) => (
                    <button
                      type="button"
                      key={op.value}
                      onClick={() => setStartStop(op.value)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                        startStop === op.value
                          ? "bg-gold border-gold text-ink-900"
                          : "bg-white border-ink-900/15 text-ink-700/60 hover:border-gold/50"
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-whatsapp hover:bg-whatsapp/90 text-white font-condensed font-black uppercase tracking-wide rounded-xl transition-colors"
              >
                <IconWhatsApp className="w-4 h-4" /> Consultar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
