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

// Eventos predefinidos de la marca
export const trackWhatsApp = (source: string) =>
  event({ action: "click_whatsapp", category: "contacto", label: source });

export const trackPhone = (source: string) =>
  event({ action: "click_phone", category: "contacto", label: source });

export const trackCall = trackPhone;

export const trackLeadForm = (status: "submit" | "success" | "error") =>
  event({ action: `lead_form_${status}`, category: "conversiones", label: "formulario_contacto" });

export const trackScrollDepth = (percent: number) =>
  event({ action: "scroll_depth", category: "engagement", label: `${percent}%`, value: percent });
