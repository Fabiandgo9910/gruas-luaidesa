"use client";
import { useState } from "react";
import { trackLeadForm } from "@/lib/analytics";
import { IconArrowRight, IconCheck } from "@/components/icons";

interface FormData {
  nombre: string;
  telefono: string;
  email: string;
  ciudad: string;
  servicio: string;
  mensaje: string;
  rgpd: boolean;
  website: string; // honeypot — debe quedar siempre vacío
}

const INITIAL: FormData = {
  nombre: "", telefono: "", email: "", ciudad: "",
  servicio: "", mensaje: "", rgpd: false, website: "",
};

const SERVICIOS = [
  "Grúa de emergencia", "Traslado de vehículo", "Rescate en carretera",
  "Vehículo averiado", "Accidente de tráfico", "Otro",
];

const inputClass =
  "w-full bg-ink-900/60 border border-gold/20 rounded-xl px-4 py-3 text-sand-100 placeholder-sand-100/25 focus:outline-none focus:border-gold transition-colors text-sm";
const labelClass = "block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1.5";

export default function LeadForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    trackLeadForm("submit");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: window.location.href,
          referrer: document.referrer || "directo",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Error del servidor");
      }

      setStatus("success");
      trackLeadForm("success");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : "No se pudo enviar el formulario. Llámanos directamente."
      );
      trackLeadForm("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-ink-800/60 border border-gold/25 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
          <IconCheck className="w-7 h-7 text-gold" />
        </div>
        <h3 className="font-condensed text-2xl font-bold text-gold-light uppercase mb-2">
          Solicitud recibida
        </h3>
        <p className="text-sand-100/60 text-sm leading-relaxed">
          Te contactamos en los próximos minutos. Si es urgente, llámanos ahora directamente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot: oculto para personas, visible para bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">No rellenar este campo</label>
        <input
          type="text" id="website" name="website" tabIndex={-1} autoComplete="off"
          value={form.website} onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className={labelClass}>Nombre *</label>
          <input
            id="nombre" type="text" name="nombre" required value={form.nombre} onChange={handleChange}
            placeholder="Tu nombre completo" className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="telefono" className={labelClass}>Teléfono *</label>
          <input
            id="telefono" type="tel" name="telefono" required value={form.telefono} onChange={handleChange}
            placeholder="+34 600 000 000" className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email" type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="tu@email.com" className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ciudad" className={labelClass}>Ciudad *</label>
          <input
            id="ciudad" type="text" name="ciudad" required value={form.ciudad} onChange={handleChange}
            placeholder="Madrid, Barcelona..." className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="servicio" className={labelClass}>Tipo de servicio *</label>
        <select
          id="servicio" name="servicio" required value={form.servicio} onChange={handleChange}
          className={inputClass}
        >
          <option value="">Selecciona un servicio</option>
          {SERVICIOS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className={labelClass}>Cuéntanos más</label>
        <textarea
          id="mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} rows={3}
          placeholder="Describe tu situación para poder ayudarte mejor..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox" name="rgpd" id="rgpd" required checked={form.rgpd} onChange={handleChange}
          className="mt-0.5 w-4 h-4 accent-[#C9A227] flex-shrink-0"
        />
        <label htmlFor="rgpd" className="text-xs text-sand-100/50 leading-relaxed">
          He leído y acepto la{" "}
          <a href="/politica-privacidad" className="text-gold underline hover:text-gold-light" target="_blank">
            Política de Privacidad
          </a>{" "}
          y el tratamiento de mis datos según el{" "}
          <a href="/proteccion-datos" className="text-gold underline hover:text-gold-light" target="_blank">
            RGPD
          </a>. *
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2.5">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-ink-900 font-condensed font-black text-lg uppercase tracking-wider rounded-xl transition-colors"
      >
        {status === "loading" ? "Enviando..." : (
          <>Solicitar servicio ahora <IconArrowRight className="w-5 h-5" /></>
        )}
      </button>
      <p className="text-center text-[11px] text-sand-100/30">
        * Campos obligatorios. Tus datos se tratan con total confidencialidad.
      </p>
    </form>
  );
}
