"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { COOKIE_CONSENT_KEY } from "@/lib/analytics";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const respond = (accepted: boolean) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? "accepted" : "rejected");
    localStorage.setItem("cookie_consent_date", new Date().toISOString());
    setVisible(false);
    // Avisa a GoogleAnalytics.tsx (montado en el mismo árbol) para que
    // cargue -o no- el script, sin necesidad de recargar la página.
    window.dispatchEvent(new Event("cookie-consent-updated"));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-5"
    >
      <div className="max-w-3xl mx-auto bg-ink-800/95 backdrop-blur border border-gold/25 rounded-2xl shadow-panel p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="flex-1 text-[13px] text-sand-100/70 leading-relaxed">
            Usamos cookies propias y analíticas para entender cómo se usa el sitio y mejorarlo.
            Solo se activan si lo aceptas. Más información en{" "}
            <Link href="/politica-privacidad" className="text-gold underline underline-offset-2 hover:text-gold-light">
              Política de Privacidad
            </Link>{" "}
            y{" "}
            <Link href="/proteccion-datos" className="text-gold underline underline-offset-2 hover:text-gold-light">
              Protección de Datos
            </Link>.
          </p>
          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={() => respond(false)}
              className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border border-gold/25 text-sand-100/60 rounded-lg hover:border-gold/50 hover:text-sand-100 transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={() => respond(true)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide bg-gold text-ink-900 rounded-lg hover:bg-gold-light transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
