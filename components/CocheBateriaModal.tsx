"use client";
import { useState } from "react";
import { IconClose, IconWhatsApp } from "@/components/icons";
import { trackWhatsAppBateria } from "@/lib/analytics";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";

export default function CocheBateriaModal() {
  const [abierto, setAbierto] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const mensaje = encodeURIComponent(
      `Hola, quiero saber qué batería lleva mi coche: ${marca} ${modelo}${anio ? ` (${anio})` : ""}.`
    );
    trackWhatsAppBateria(`consulta_coche:${marca} ${modelo} ${anio}`.trim());
    window.open(`https://wa.me/${WA}?text=${mensaje}`, "_blank", "noopener,noreferrer");
    setAbierto(false);
    setMarca("");
    setModelo("");
    setAnio("");
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
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-900/80 backdrop-blur-sm px-5"
          onClick={() => setAbierto(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-sand-100 rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-panel"
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
              Dinos la marca, modelo y año de tu vehículo y te decimos por WhatsApp la batería exacta y el precio.
            </p>
            <form onSubmit={enviar} className="space-y-4">
              <input
                required value={marca} onChange={(e) => setMarca(e.target.value)}
                placeholder="Marca (ej. Seat, Renault...)"
                className="w-full bg-white border border-ink-900/15 rounded-xl px-4 py-3 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:border-gold text-sm"
              />
              <input
                required value={modelo} onChange={(e) => setModelo(e.target.value)}
                placeholder="Modelo (ej. Ibiza, Clio...)"
                className="w-full bg-white border border-ink-900/15 rounded-xl px-4 py-3 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:border-gold text-sm"
              />
              <input
                value={anio} onChange={(e) => setAnio(e.target.value)}
                placeholder="Año (opcional)"
                className="w-full bg-white border border-ink-900/15 rounded-xl px-4 py-3 text-ink-900 placeholder-ink-900/30 focus:outline-none focus:border-gold text-sm"
              />
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
