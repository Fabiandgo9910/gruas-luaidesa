"use client";
import { IconWhatsApp } from "@/components/icons";
import { trackWhatsAppBateria } from "@/lib/analytics";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";

export default function BateriaWhatsAppButton({ nombre }: { nombre: string }) {
  const mensaje = encodeURIComponent(`Hola, me interesa la batería ${nombre}. ¿Precio y disponibilidad?`);

  return (
    <a
      href={`https://wa.me/${WA}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppBateria(nombre)}
      className="inline-flex items-center justify-center gap-3 bg-whatsapp hover:bg-whatsapp/90 text-white font-condensed font-black text-lg uppercase tracking-wide rounded-full px-8 py-4 transition-all hover:-translate-y-0.5"
    >
      <IconWhatsApp className="w-5 h-5" /> Consultar por WhatsApp
    </a>
  );
}
