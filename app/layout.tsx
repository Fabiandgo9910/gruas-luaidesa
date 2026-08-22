import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gruasluaidesa.com";
const PHONE_E164 = "+34674088195";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "gruasluaidesa@gmail.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Grúas Luaidesa | Servicio de Grúa 24h en Madrid y toda España",
    template: "%s | Grúas Luaidesa",
  },
  description:
    "Servicio de grúa y rescate vehicular en Madrid y toda España. Disponibles 24 horas, 7 días a la semana. Respuesta rápida, precio cerrado y factura legal. Llámanos ahora.",
  keywords: [
    "grúas Madrid", "servicio de grúa Madrid", "grúa 24 horas Madrid",
    "rescate vehicular Madrid", "grúas España", "auxilio en carretera Madrid",
    "grúa económica Madrid", "remolque coche Madrid", "grúa avería Madrid",
    "servicio grúa urgente", "grúas Luaidesa",
  ],
  authors: [{ name: "Grúas Luaidesa" }],
  creator: "Grúas Luaidesa",
  publisher: "Grúas Luaidesa",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Grúas Luaidesa",
    title: "Grúas Luaidesa | Servicio de Grúa 24h en Madrid y toda España",
    description: "Servicio de grúa y rescate vehicular en Madrid y toda España. Respuesta rápida, precio cerrado y factura legal.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Grúas Luaidesa - Servicio de Grúa 24h" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grúas Luaidesa | Servicio de Grúa 24h",
    description: "Servicio de grúa y rescate vehicular en Madrid y toda España.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: SITE_URL },
  other: {
    "geo.region": "ES-MD",
    "geo.placename": "Madrid",
    "geo.position": "40.4168;-3.7038",
    ICBM: "40.4168, -3.7038",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Grúas Luaidesa",
  description: "Servicio de grúa y rescate vehicular disponible 24 horas en Madrid y toda España.",
  url: SITE_URL,
  telephone: PHONE_E164,
  email: EMAIL,
  address: { "@type": "PostalAddress", addressLocality: "Madrid", addressRegion: "Madrid", addressCountry: "ES" },
  geo: { "@type": "GeoCoordinates", latitude: "40.4168", longitude: "-3.7038" },
  areaServed: [{ "@type": "City", name: "Madrid" }, { "@type": "Country", name: "España" }],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  serviceType: "Grúa y rescate vehicular",
  priceRange: "€€",
  image: `${SITE_URL}/og-image.jpg`,
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Servicio de Grúa 24h",
  provider: { "@type": "LocalBusiness", name: "Grúas Luaidesa" },
  areaServed: { "@type": "Country", name: "España" },
  description: "Rescate vehicular, traslado de vehículos y asistencia en carretera disponible las 24 horas.",
  serviceType: "Grúa y asistencia en carretera",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      </head>
      <body className="bg-brand-black font-sans antialiased">
        <GoogleAnalytics />
        {children}
        <FloatingWhatsApp />
        <CookieBanner />
      </body>
    </html>
  );
}
