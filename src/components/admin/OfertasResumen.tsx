import type { Product } from "@/types";
import { Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default function OfertasResumen({ products }: { products: Product[] }) {
  const offers = products.filter((p) => p.is_offer);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Tag size={18} /> Ofertas del día
        </h2>
        <p className="text-neutral-500 text-sm">
          Marca la etiqueta 🏷️ en la pestaña "Productos" para añadir o quitar
          ofertas — aquí ves un resumen rápido.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
        {offers.length === 0 && (
          <p className="p-6 text-sm text-neutral-400">Ningún producto en oferta todavía.</p>
        )}
        {offers.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
              {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.name}</p>
              <p className="text-xs text-neutral-400">
                {formatPrice(p.price)} → {formatPrice(p.offer_price ?? p.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
