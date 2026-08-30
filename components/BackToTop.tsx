"use client";
import { useEffect, useState } from "react";
import { IconChevronDown } from "@/components/icons";

/**
 * Botón flotante "volver arriba" — aparece con una micro-transición
 * tras bajar 500px, y sube con scroll suave.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      className={`theme-invariant fixed right-5 z-40 w-11 h-11 rounded-full bg-ink-900/90 backdrop-blur border border-gold/25 text-gold flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-ink-800 active:scale-95 bottom-24 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <IconChevronDown className="w-4 h-4 rotate-180" />
    </button>
  );
}
