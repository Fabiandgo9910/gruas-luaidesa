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
    default: "Grúas Luaidesa | Grúa 24h y Baterías a Domicilio",
    template: "%s | Grúas Luaidesa",
  },
  description:
    "Grúa y rescate vehicular 24h en Madrid y toda España. Venta e instalación de baterías de coche a domicilio en Madrid. Respuesta rápida y factura legal.",
  keywords: [
    "grúas Madrid", "servicio de grúa Madrid", "grúa 24 horas Madrid",
    "rescate vehicular Madrid", "grúas España", "auxilio en carretera Madrid",
    "grúa económica Madrid", "remolque coche Madrid", "grúa avería Madrid",
    "servicio grúa urgente", "grúas Luaidesa",
    "baterías de coche Madrid", "batería de coche a domicilio Madrid",
    "cambio de batería coche Madrid", "batería Start-Stop Madrid",
    "instalación batería coche a domicilio",
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
    title: "Grúas Luaidesa | Grúa 24h y Baterías de Coche a Domicilio",
    description: "Servicio de grúa y rescate vehicular 24h, y venta e instalación de baterías de coche a domicilio en Madrid y alrededores.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Grúas Luaidesa - Grúa 24h y Baterías a domicilio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grúas Luaidesa | Grúa 24h y Baterías de Coche a Domicilio",
    description: "Servicio de grúa y rescate vehicular 24h, y venta e instalación de baterías de coche a domicilio.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: SITE_URL },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  other: {
    "geo.region": "ES-MD",
    "geo.placename": "Madrid",
  },
};

const REDES_SOCIALES = [process.env.NEXT_PUBLIC_FACEBOOK_URL, process.env.NEXT_PUBLIC_INSTAGRAM_URL].filter(
  (url): url is string => !!url
);

// Localidades reales de cobertura (mismas que se muestran en la sección
// "Cobertura geográfica" de la home) — refuerzan el SEO local por zona.
const ZONAS_COBERTURA = [
  "Madrid", "Alcalá de Henares", "Getafe", "Leganés", "Alcorcón", "Móstoles",
  "Fuenlabrada", "Parla", "Torrejón de Ardoz", "Pozuelo de Alarcón",
  "Majadahonda", "Las Rozas de Madrid", "Coslada", "Rivas-Vaciamadrid", "Valdemoro",
];

// Sin dirección física ni coordenadas exactas: es un negocio de servicio a
// domicilio (sin local al que pueda acudir el cliente), así que seguimos la
// recomendación de Google de omitir "address"/"geo" y declarar solo las
// zonas de cobertura mediante "areaServed".
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Grúas Luaidesa",
  description: "Servicio de grúa y rescate vehicular disponible 24 horas en Madrid y toda España.",
  url: SITE_URL,
  telephone: PHONE_E164,
  email: EMAIL,
  areaServed: [
    ...ZONAS_COBERTURA.map((z) => ({ "@type": "City", name: z })),
    { "@type": "Country", name: "España" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  serviceType: "Grúa y rescate vehicular",
  priceRange: "€€",
  image: `${SITE_URL}/og-image.jpg`,
  ...(REDES_SOCIALES.length > 0 ? { sameAs: REDES_SOCIALES } : {}),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Servicio de Grúa 24h",
  provider: { "@id": `${SITE_URL}/#business` },
  areaServed: [
    ...ZONAS_COBERTURA.map((z) => ({ "@type": "City", name: z })),
    { "@type": "Country", name: "España" },
  ],
  description: "Rescate vehicular, traslado de vehículos y asistencia en carretera disponible las 24 horas.",
  serviceType: "Grúa y asistencia en carretera",
};

const bateriasServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Venta e instalación de baterías de coche a domicilio",
  provider: { "@id": `${SITE_URL}/#business` },
  areaServed: ZONAS_COBERTURA.map((z) => ({ "@type": "City", name: z })),
  description:
    "Venta e instalación a domicilio de baterías de coche de todas las marcas y amperajes, incluidas las de sistema Start-Stop, en Madrid y alrededores.",
  serviceType: "Venta e instalación de baterías de coche",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bateriasServiceSchema) }} />
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
