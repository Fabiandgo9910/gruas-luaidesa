"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { trackPhone, trackWhatsApp } from "@/lib/analytics";
import { IconPhone, IconWhatsApp, IconMenu, IconClose } from "@/components/icons";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";
const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+34 674 08 81 95";
const WA_MSG = encodeURIComponent("Hola, necesito una grúa urgente.");

const NAV_LINKS = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#cobertura", label: "Cobertura" },
  { href: "/#proceso", label: "Cómo trabajamos" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-brand-black/95 backdrop-blur-md border-b border-gold/15 py-3.5">
      <div className="max-w-container mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 leading-none group">
          <span className="font-condensed text-xl font-black text-brand-cream tracking-wide uppercase">
            Grúas
          </span>
          <span className="font-condensed text-xl font-black text-gold tracking-[0.1em] uppercase">
            Luaidesa
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-brand-cream/60 hover:text-gold transition-colors text-[13px] font-medium uppercase tracking-widest"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            onClick={() => trackPhone("navbar")}
            className="flex items-center gap-2 text-[13px] font-semibold text-brand-cream/90 border border-gold/25 rounded-full pl-3.5 pr-4 py-2 hover:border-gold hover:text-gold transition-colors"
          >
            <IconPhone className="w-4 h-4" /> {PHONE}
          </a>
          <a
            href={`https://wa.me/${WA}?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("navbar")}
            className="flex items-center gap-2 text-[13px] font-semibold bg-gold hover:bg-gold-light text-brand-black rounded-full pl-3.5 pr-4 py-2 transition-colors"
          >
            <IconWhatsApp className="w-4 h-4" /> WhatsApp
          </a>
        </div>

        <button
          className="lg:hidden text-gold p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-brand-black/98 backdrop-blur-sm border-t border-gold/15 px-5 py-8 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-brand-cream/80 hover:text-gold py-3.5 text-xl font-condensed font-bold uppercase tracking-wide border-b border-gold/10"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-6 space-y-3">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              onClick={() => { trackPhone("navbar_mobile"); setOpen(false); }}
              className="flex items-center justify-center gap-2 w-full py-3.5 border border-gold/40 rounded-xl text-gold font-semibold"
            >
              <IconPhone className="w-4 h-4" /> {PHONE}
            </a>
            <a
              href={`https://wa.me/${WA}?text=${WA_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackWhatsApp("navbar_mobile"); setOpen(false); }}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold rounded-xl text-brand-black font-semibold"
            >
              <IconWhatsApp className="w-4 h-4" /> WhatsApp urgente
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
