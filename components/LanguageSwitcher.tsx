"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useIdioma } from "@/components/LanguageProvider";
import { IDIOMAS } from "@/lib/i18n/diccionarios";

/**
 * El desplegable se renderiza con un portal directamente en <body>,
 * posicionado con "fixed" a partir de las coordenadas reales del
 * botón. Así escapa por completo del header (que usa backdrop-filter
 * para el efecto cristal) y nunca puede quedar recortado o "perdido"
 * por culpa del contexto de apilamiento/recorte que crea el blur —
 * el mismo tipo de problema que ya tuvimos con el menú móvil.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { idioma, setIdioma } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const [montado, setMontado] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMontado(true), []);

  const actualizarCoords = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setCoords({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  };

  const toggle = () => {
    if (!abierto) actualizarCoords();
    setAbierto((v) => !v);
  };

  useEffect(() => {
    if (!abierto) return;

    const cerrar = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setAbierto(false);
      }
    };
    const onScrollOrResize = () => actualizarCoords();

    document.addEventListener("mousedown", cerrar);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", cerrar);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [abierto]);

  return (
    <div className={className}>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label="Cambiar idioma"
        className="btn-tap h-9 px-3 rounded-full border border-gold/25 hover:border-gold text-gold text-xs font-bold tracking-wide flex items-center gap-1"
      >
        {IDIOMAS.find((i) => i.code === idioma)?.label}
      </button>

      {montado && abierto &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, right: coords.right }}
            className="glass-3 rounded-xl overflow-hidden z-[300] min-w-[100px]"
          >
            {IDIOMAS.map((i) => (
              <button
                key={i.code}
                onClick={() => { setIdioma(i.code); setAbierto(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                  idioma === i.code ? "text-gold bg-gold/10" : "on-surface/70 hover:text-gold hover:bg-white/5"
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
