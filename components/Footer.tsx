import Link from "next/link";
import { IconPhone, IconWhatsApp, IconChevronDown } from "@/components/icons";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";
const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+34 674 08 81 95";
const PHONE_HREF = PHONE.replace(/\s/g, "");

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-gold/15 py-14 pb-28 md:pb-14">
      <div className="max-w-container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="font-condensed font-black text-2xl text-gold-light uppercase tracking-wider mb-3">Grúas Luaidesa</p>
            <p className="text-sand-100/40 text-sm leading-relaxed max-w-xs">
              Servicio de grúa y rescate vehicular, y venta e instalación de baterías de coche a domicilio, en Madrid y toda España.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">Enlaces</p>
            <ul className="space-y-2">
              <li><Link href="/#servicios" className="text-sand-100/40 hover:text-gold text-sm transition-colors">Servicio de grúa</Link></li>
              <li><Link href="/baterias-coche-madrid" className="text-sand-100/40 hover:text-gold text-sm transition-colors">Baterías de coche</Link></li>
              <li><Link href="/politica-privacidad" className="text-sand-100/40 hover:text-gold text-sm transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/condiciones-uso" className="text-sand-100/40 hover:text-gold text-sm transition-colors">Condiciones de Uso</Link></li>
              <li><Link href="/proteccion-datos" className="text-sand-100/40 hover:text-gold text-sm transition-colors">Protección de Datos (RGPD)</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">Contacto urgente</p>
            <a href={`tel:${PHONE_HREF}`} className="block text-gold-light font-semibold mb-1 hover:text-gold transition-colors">{PHONE}</a>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-whatsapp text-sm hover:text-whatsapp/80 transition-colors mb-3">
              WhatsApp directo <IconChevronDown className="w-3 h-3 -rotate-90" />
            </a>
            <p className="text-xs text-sand-100/30">Disponible 24h · 7 días · Madrid y España</p>
          </div>
        </div>
        <div className="border-t border-sand-100/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-sand-100/30">© {new Date().getFullYear()} Grúas Luaidesa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
