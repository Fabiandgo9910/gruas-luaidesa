import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luaidesa.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/panel-control/"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
