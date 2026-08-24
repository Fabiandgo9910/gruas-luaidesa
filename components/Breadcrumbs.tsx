import Link from "next/link";
import { IconChevronDown } from "@/components/icons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luaidesa.com";

export interface Miga {
  label: string;
  href?: string; // sin href = elemento actual (no clicable)
}

/**
 * Migas de pan visibles + JSON-LD BreadcrumbList a juego.
 * Ayuda a Google a entender la jerarquía del sitio (Inicio > Baterías >
 * Modelo) y suele mostrarse directamente en los resultados de búsqueda.
 */
export default function Breadcrumbs({ items }: { items: Miga[] }) {
  const todas: Miga[] = [{ label: "Inicio", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todas.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Migas de pan" className="flex items-center flex-wrap gap-1.5 text-xs text-ink-700/40 mb-6">
        {todas.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <IconChevronDown className="w-2.5 h-2.5 -rotate-90" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-gold-dark transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-900/60 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
