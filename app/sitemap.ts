import { MetadataRoute } from "next";
import { getBateriasPublicadas } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luaidesa.com";

  const estaticas: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/baterias-coche-madrid`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/politica-privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/condiciones-uso`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/proteccion-datos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Añade una URL por cada batería publicada. Si Supabase no está
  // configurado (p.ej. en un build sin variables de entorno), no
  // rompe el sitemap: simplemente no añade las fichas de producto.
  try {
    const baterias = await getBateriasPublicadas();
    const paginasBaterias: MetadataRoute.Sitemap = baterias.map((b) => ({
      url: `${base}/baterias-coche-madrid/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...estaticas, ...paginasBaterias];
  } catch {
    return estaticas;
  }
}
