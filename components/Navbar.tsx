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
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Cierra el menú si la ventana pasa a tamaño de escritorio con el menú abierto
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-ink-900/95 backdrop-blur-md border-b border-gold/15 h-16 flex items-center">
        <div className="max-w-container mx-auto px-5 flex items-center justify-between w-full">
          <Link href="/" className="flex items-baseline gap-2 leading-none group">
            <span className="font-condensed text-xl font-black text-sand-100 tracking-wide uppercase">
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
                className="text-sand-100/60 hover:text-gold transition-colors text-[13px] font-medium uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              onClick={() => trackPhone("navbar")}
              className="flex items-center gap-2 text-[13px] font-semibold text-sand-100/90 border border-gold/25 rounded-full pl-3.5 pr-4 py-2 hover:border-gold hover:text-gold transition-colors"
            >
              <IconPhone className="w-4 h-4" /> {PHONE}
            </a>
            <a
              href={`https://wa.me/${WA}?text=${WA_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsApp("navbar")}
              className="flex items-center gap-2 text-[13px] font-semibold bg-gold hover:bg-gold-light text-ink-900 rounded-full pl-3.5 pr-4 py-2 transition-colors"
            >
              <IconWhatsApp className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          <button
            type="button"
            className="lg:hidden text-gold p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-[100] bg-ink-900 border-t border-gold/15 px-5 py-8 space-y-1 overflow-y-auto overscroll-contain"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-sand-100 hover:text-gold py-3.5 text-xl font-condensed font-bold uppercase tracking-wide border-b border-gold/10"
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
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold rounded-xl text-ink-900 font-semibold"
            >
              <IconWhatsApp className="w-4 h-4" /> WhatsApp urgente
            </a>
          </div>
        </div>
      )}
    </>
  );
}