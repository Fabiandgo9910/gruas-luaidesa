import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gruasluaidesa.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/politica-privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/condiciones-uso`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/proteccion-datos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
