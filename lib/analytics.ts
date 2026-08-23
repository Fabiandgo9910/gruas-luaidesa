// ============================================================
// Grúas Luaidesa — Utilidades de Analytics (GA4)
// ============================================================
// Importante (RGPD): estas funciones NO cargan ningún script por sí
// solas. GA4 solo se inyecta en el DOM cuando el usuario acepta
// cookies analíticas (ver components/CookieBanner.tsx y
// components/GoogleAnalytics.tsx). Antes de eso, gtag no existe y
// estas funciones simplemente no hacen nada.

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const COOKIE_CONSENT_KEY = "cookie_consent";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

/**
 * Inyecta gtag.js en el DOM. Solo debe llamarse tras obtener
 * consentimiento explícito. Es idempotente: si ya está cargado, no
 * vuelve a insertarlo.
 */
export function loadGoogleAnalytics() {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  if (document.getElementById("ga4-script")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
}

type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export function event({ action, category, label, value }: GtagEvent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// ============================================================
// Control interno de contactos (independiente de GA4)
// ============================================================
// Además del evento de GA4, registramos cada contacto real
// (llamada, WhatsApp, formulario) en nuestra propia base de datos
// para que el panel de administración (/panel-control) muestre
// cifras exactas sin depender de bloqueadores de anuncios ni de
// que el usuario haya aceptado cookies analíticas.
// Es "fire and forget": si falla, nunca bloquea ni rompe la acción
// del usuario (llamar, escribir, enviar el formulario).
type TipoEventoContacto = "llamada" | "whatsapp" | "whatsapp_bateria" | "formulario";

function registrarContacto(tipo: TipoEventoContacto, origen: string, detalle?: string) {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo,
        origen,
        detalle,
        pagina: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Silencioso a propósito — ver comentario de arriba.
  }
}

// Eventos predefinidos de la marca
export const trackWhatsApp = (source: string) => {
  event({ action: "click_whatsapp", category: "contacto", label: source });
  registrarContacto("whatsapp", source);
};

export const trackPhone = (source: string) => {
  event({ action: "click_phone", category: "contacto", label: source });
  registrarContacto("llamada", source);
};

export const trackCall = trackPhone;

export const trackLeadForm = (status: "submit" | "success" | "error") => {
  event({ action: `lead_form_${status}`, category: "conversiones", label: "formulario_contacto" });
  if (status === "success") registrarContacto("formulario", "formulario_contacto");
};

export const trackScrollDepth = (percent: number) =>
  event({ action: "scroll_depth", category: "engagement", label: `${percent}%`, value: percent });

/** Clic en "consultar por WhatsApp" desde la tienda de baterías */
export const trackWhatsAppBateria = (modelo: string) => {
  event({ action: "click_whatsapp_bateria", category: "tienda_baterias", label: modelo });
  registrarContacto("whatsapp_bateria", "ficha_bateria", modelo);
};
