"use client";
import { trackWhatsApp } from "@/lib/analytics";
import { IconWhatsApp } from "@/components/icons";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";
const WA_MSG = encodeURIComponent("Hola, necesito una grúa. ¿Podéis ayudarme?");

/**
 * Botón flotante de WhatsApp. Solo en escritorio: en móvil ya existe
 * la barra sticky inferior (ver app/page.tsx), y duplicar ambos
 * elementos a la vez tapa contenido en pantallas pequeñas.
 */
export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WA}?text=${WA_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp("flotante")}
      aria-label="Contactar por WhatsApp"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 bg-[#25D366] text-white pl-4 pr-5 py-3.5 rounded-full shadow-panel hover:bg-[#1fb958] hover:scale-105 transition-all duration-200"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white/70 animate-ping-slow" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      <IconWhatsApp className="w-5 h-5" />
      <span className="text-sm font-semibold tracking-wide">Escríbenos</span>
    </a>
  );
}
