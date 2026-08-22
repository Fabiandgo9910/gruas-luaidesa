"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { GA_MEASUREMENT_ID, hasAnalyticsConsent, loadGoogleAnalytics, pageview, COOKIE_CONSENT_KEY } from "@/lib/analytics";

function GAPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * No carga ningún script de Google por defecto. Solo lo hace si:
 * a) el usuario ya había aceptado cookies en una visita anterior, o
 * b) acepta cookies durante esta visita (evento "cookie-consent-updated"
 *    disparado por CookieBanner).
 * Así el consentimiento es real y previo, no solo cosmético.
 */
export default function GoogleAnalytics() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    if (hasAnalyticsConsent()) {
      loadGoogleAnalytics();
      setLoaded(true);
    }

    const onConsentChange = () => {
      if (hasAnalyticsConsent()) {
        loadGoogleAnalytics();
        setLoaded(true);
      }
    };

    window.addEventListener("cookie-consent-updated", onConsentChange);
    window.addEventListener("storage", (e) => {
      if (e.key === COOKIE_CONSENT_KEY) onConsentChange();
    });

    return () => window.removeEventListener("cookie-consent-updated", onConsentChange);
  }, []);

  if (!GA_MEASUREMENT_ID || !loaded) return null;

  return (
    <Suspense fallback={null}>
      <GAPageTracker />
    </Suspense>
  );
}
