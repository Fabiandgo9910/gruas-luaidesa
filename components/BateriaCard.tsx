"use client";
import Link from "next/link";
import { IconWhatsApp, IconBolt } from "@/components/icons";
import { trackWhatsAppBateria } from "@/lib/analytics";
import type { Bateria } from "@/lib/supabase";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";

export default function BateriaCard({ bateria }: { bateria: Bateria }) {
  const mensaje = encodeURIComponent(
    `Hola, me interesa la batería ${bateria.marca ? `${bateria.marca} ` : ""}${bateria.modelo}. ¿Precio y disponibilidad?`
  );

  return (
    <article className="glass glass-hover rounded-2xl overflow-hidden transition-all hover:-translate-y-1 group flex flex-col">
      <Link href={`/baterias-coche-madrid/${bateria.slug}`} className="block aspect-square bg-sand-100 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bateria.imagen_url}
          alt={`Batería ${bateria.marca || ""} ${bateria.modelo}`.trim()}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {bateria.start_stop && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-gold text-ink-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
            <IconBolt className="w-3 h-3" /> Start-Stop
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {bateria.marca && (
          <p className="text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1">{bateria.marca}</p>
        )}
        <Link href={`/baterias-coche-madrid/${bateria.slug}`}>
          <h3 className="font-condensed font-bold text-lg text-sand-100 uppercase mb-2 group-hover:text-gold transition-colors">
            {bateria.modelo}
          </h3>
        </Link>

        <div className="flex items-center gap-3 text-xs text-sand-100/50 mb-4">
          {bateria.amperaje && <span>{bateria.amperaje} Ah</span>}
          {bateria.precio && <span className="text-gold-light font-semibold text-sm">{bateria.precio} €</span>}
        </div>

        <a
          href={`https://wa.me/${WA}?text=${mensaje}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppBateria(`${bateria.marca || ""} ${bateria.modelo}`.trim())}
          className="mt-auto flex items-center justify-center gap-2 py-3 bg-whatsapp hover:bg-whatsapp/90 text-white text-sm font-semibold rounded-xl btn-tap"
        >
          <IconWhatsApp className="w-4 h-4" /> Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}
