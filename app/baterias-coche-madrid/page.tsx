import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import BateriasStore from "@/components/BateriasStore";
import { getBateriasPublicadas } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gruasluaidesa.com";
const PHONE_E164 = "+34674088195";
const PATH = "/baterias-coche-madrid";

export const metadata: Metadata = {
  title: "Venta e instalación de baterías de coche a domicilio en Madrid",
  description:
    "Compra tu batería de coche online y te la instalamos a domicilio en Madrid y alrededores. Todas las marcas, con y sin sistema Start-Stop. Consulta precio por WhatsApp.",
  keywords: [
    "baterías de coche Madrid", "cambio de batería a domicilio Madrid", "batería coche Start-Stop Madrid",
    "instalación batería coche Madrid", "comprar batería de coche Madrid", "batería arranque parada Madrid",
    "baterías de coche baratas Madrid", "sustitución batería coche a domicilio",
  ],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${PATH}`,
    title: "Venta e instalación de baterías de coche a domicilio en Madrid",
    description: "Todas las marcas y amperajes, con y sin Start-Stop. Te la instalamos donde estés, en Madrid y alrededores.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Baterías de coche a domicilio en Madrid" }],
  },
};

export const dynamic = "force-dynamic";

export default async function TiendaBateriasPage() {
  let baterias: Awaited<ReturnType<typeof getBateriasPublicadas>> = [];
  let error = "";
  try {
    baterias = await getBateriasPublicadas();
  } catch (err) {
    error = err instanceof Error ? err.message : "Error desconocido";
    console.error("[/baterias-coche-madrid] Error al cargar baterías:", err);
  }

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "@id": `${SITE_URL}${PATH}#tienda`,
    name: "Grúas Luaidesa — Baterías de coche a domicilio",
    description: "Venta e instalación a domicilio de baterías de coche en Madrid y alrededores.",
    url: `${SITE_URL}${PATH}`,
    telephone: PHONE_E164,
    areaServed: { "@type": "City", name: "Madrid" },
    priceRange: "€€",
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: baterias.slice(0, 30).map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${PATH}/${b.slug}`,
      name: `${b.marca ? `${b.marca} ` : ""}${b.modelo}`,
    })),
  };

  return (
    <main>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <section className="pt-32 pb-16 bg-sand-100">
        <div className="max-w-container mx-auto px-5">
          <Breadcrumbs items={[{ label: "Baterías de coche" }]} />
          <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Tienda de baterías</p>
          <h1 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-ink-900 mb-5">
            Baterías de coche <span className="text-gold">a domicilio en Madrid</span>
          </h1>
          <p className="max-w-2xl text-ink-700/60 leading-relaxed">
            Elige tu batería por marca, amperaje o sistema Start-Stop y te la instalamos donde estés, en Madrid
            capital y alrededores. Consulta el precio exacto de cada modelo directamente por WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-ink-900 min-h-[50vh]">
        <div className="max-w-container mx-auto px-5">
          {error ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-red-300 text-sm">
              No se ha podido cargar el catálogo en este momento. Vuelve a intentarlo en unos minutos.
            </div>
          ) : (
            <BateriasStore baterias={baterias} />
          )}
        </div>
      </section>
    </main>
  );
}
