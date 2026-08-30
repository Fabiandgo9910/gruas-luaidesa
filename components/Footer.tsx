"use client";
import Link from "next/link";
import { IconPhone, IconWhatsApp, IconChevronDown } from "@/components/icons";
import { useIdioma } from "@/components/LanguageProvider";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";
const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+34 674 08 81 95";
const PHONE_HREF = PHONE.replace(/\s/g, "");

export default function Footer() {
  const { t } = useIdioma();
  return (
    <footer className="surface-1 border-t border-gold/15 py-14 pb-28 md:pb-14 relative overflow-hidden">
      <div className="orb-field">
        <div className="orb orb-gold w-96 h-96 -bottom-32 left-1/3" />
      </div>
      <div className="max-w-container mx-auto px-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="font-condensed font-black text-2xl on-surface-heading uppercase tracking-wider mb-3">Grúas Luaidesa</p>
            <p className="on-surface/40 text-sm leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">{t.footer.linksTitle}</p>
            <ul className="space-y-2">
              <li><Link href="/#servicios" className="on-surface/40 hover:text-gold text-sm transition-colors">{t.footer.linkGrua}</Link></li>
              <li><Link href="/baterias-coche-madrid" className="on-surface/40 hover:text-gold text-sm transition-colors">{t.footer.linkBaterias}</Link></li>
              <li><Link href="/politica-privacidad" className="on-surface/40 hover:text-gold text-sm transition-colors">{t.footer.linkPrivacidad}</Link></li>
              <li><Link href="/condiciones-uso" className="on-surface/40 hover:text-gold text-sm transition-colors">{t.footer.linkCondiciones}</Link></li>
              <li><Link href="/proteccion-datos" className="on-surface/40 hover:text-gold text-sm transition-colors">{t.footer.linkRgpd}</Link></li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">{t.footer.contactTitle}</p>
            <a href={`tel:${PHONE_HREF}`} className="block on-surface-heading font-semibold mb-1 hover:text-gold transition-colors">{PHONE}</a>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-whatsapp text-sm hover:text-whatsapp/80 transition-colors mb-3">
              {t.footer.whatsappDirecto} <IconChevronDown className="w-3 h-3 -rotate-90" />
            </a>
            <p className="text-xs on-surface/30">{t.footer.disponible}</p>
          </div>
        </div>
        <div className="border-t on-surface-border/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs on-surface/30">© {new Date().getFullYear()} Grúas Luaidesa. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
