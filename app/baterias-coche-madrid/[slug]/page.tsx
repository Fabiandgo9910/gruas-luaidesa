import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconBolt, IconArrowRight } from "@/components/icons";
import BateriaWhatsAppButton from "@/components/BateriaWhatsAppButton";
import { getBateriaPorSlug, getBateriasPublicadas } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gruasluaidesa.com";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const bateria = await getBateriaPorSlug(params.slug).catch(() => null);
  if (!bateria || !bateria.publicado) {
    return { title: "Batería no encontrada" };
  }

  const nombre = `${bateria.marca ? `${bateria.marca} ` : ""}${bateria.modelo}`;
  const path = `/baterias-coche-madrid/${bateria.slug}`;
  const descripcion = `Batería de coche ${nombre}${bateria.amperaje ? ` de ${bateria.amperaje} Ah` : ""}${
    bateria.start_stop ? ", compatible con sistema Start-Stop" : ""
  }. Instalación a domicilio en Madrid y alrededores. Consulta precio por WhatsApp.`;

  return {
    title: `Batería ${nombre} — Instalación a domicilio en Madrid`,
    description: descripcion,
    keywords: [
      `batería ${nombre}`, `batería ${bateria.marca || ""} Madrid`, "cambio de batería a domicilio Madrid",
      bateria.start_stop ? "batería Start-Stop Madrid" : "batería de coche Madrid",
    ],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${path}`,
      title: `Batería ${nombre} — Grúas Luaidesa`,
      description: descripcion,
      images: [{ url: bateria.imagen_url, width: 800, height: 800, alt: nombre }],
    },
  };
}

export default async function BateriaDetallePage({ params }: { params: { slug: string } }) {
  const bateria = await getBateriaPorSlug(params.slug).catch(() => null);
  if (!bateria || !bateria.publicado) notFound();

  const nombre = `${bateria.marca ? `${bateria.marca} ` : ""}${bateria.modelo}`;

  let relacionadas: Awaited<ReturnType<typeof getBateriasPublicadas>> = [];
  try {
    relacionadas = (await getBateriasPublicadas())
      .filter((b) => b.id !== bateria.id && b.marca === bateria.marca)
      .slice(0, 3);
  } catch {
    relacionadas = [];
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nombre,
    image: bateria.imagen_url,
    brand: bateria.marca ? { "@type": "Brand", name: bateria.marca } : undefined,
    description: `Batería de coche ${nombre}${bateria.amperaje ? ` de ${bateria.amperaje} Ah` : ""}${
      bateria.start_stop ? ", compatible con sistema Start-Stop" : ""
    }, instalada a domicilio en Madrid.`,
    offers: bateria.precio
      ? {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: bateria.precio,
          availability: "https://schema.org/InStock",
          areaServed: { "@type": "City", name: "Madrid" },
        }
      : undefined,
  };

  return (
    <main>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <section className="pt-32 pb-20 bg-sand-100">
        <div className="max-w-container mx-auto px-5">
          <Link href="/baterias-coche-madrid" className="text-ink-700/50 hover:text-gold text-sm font-medium mb-8 inline-flex items-center gap-1.5">
            ← Volver al catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-6">
            <div className="bg-sand-200 rounded-2xl p-10 flex items-center justify-center relative">
              {bateria.start_stop && (
                <span className="absolute top-5 left-5 flex items-center gap-1 bg-gold text-ink-900 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                  <IconBolt className="w-3.5 h-3.5" /> Start-Stop
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bateria.imagen_url} alt={nombre} className="max-w-full max-h-[380px] object-contain" />
            </div>

            <div>
              {bateria.marca && (
                <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">{bateria.marca}</p>
              )}
              <h1 className="font-condensed font-black text-4xl sm:text-5xl uppercase text-ink-900 mb-5">
                {bateria.modelo}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {bateria.amperaje && (
                  <span className="text-ink-700/60 text-sm bg-sand-200 border border-ink-900/10 rounded-full px-4 py-1.5">
                    {bateria.amperaje} Ah
                  </span>
                )}
                {bateria.precio && (
                  <span className="font-condensed font-black text-3xl text-gold-dark">{bateria.precio} €</span>
                )}
              </div>

              <p className="text-ink-700/60 leading-relaxed mb-8 max-w-md">
                Batería {nombre} con instalación a domicilio incluida en Madrid capital y alrededores.
                {bateria.start_stop ? " Compatible con sistemas de arranque y parada (Start-Stop)." : ""} Consulta
                disponibilidad y precio final directamente por WhatsApp.
              </p>

              <BateriaWhatsAppButton nombre={nombre} />
            </div>
          </div>

          {relacionadas.length > 0 && (
            <div className="mt-20">
              <h2 className="font-condensed font-black text-2xl uppercase text-ink-900 mb-6">
                Otras baterías {bateria.marca}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relacionadas.map((r) => (
                  <Link
                    key={r.id}
                    href={`/baterias-coche-madrid/${r.slug}`}
                    className="bg-sand-200 border border-ink-900/10 hover:border-gold/50 rounded-2xl p-5 flex items-center gap-4 transition-colors group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.imagen_url} alt={r.modelo} className="w-16 h-16 object-contain" />
                    <div>
                      <p className="font-condensed font-bold text-ink-900 uppercase group-hover:text-gold-dark transition-colors">{r.modelo}</p>
                      {r.precio && <p className="text-sm text-ink-700/50">{r.precio} €</p>}
                    </div>
                    <IconArrowRight className="w-4 h-4 text-ink-900/30 ml-auto group-hover:text-gold-dark transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
