"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Tag, ChefHat, Eye, EyeOff } from "lucide-react";
import { deleteProduct, toggleProductField } from "@/app/admin/actions";
import ProductFormModal from "./ProductFormModal";
import { cn, formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/types";

export default function ProductsManager({
  restaurantId,
  categories,
  products,
}: {
  restaurantId: string;
  categories: Category[];
  products: Product[];
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setModalOpen(true);
  }
  function handleSaved() {
    setModalOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">Productos</h2>
          <p className="text-neutral-500 text-sm">
            Precios, descripciones, fotos, ingredientes y alérgenos.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-black text-white rounded-xl px-4 py-2.5 text-sm"
        >
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
        {products.length === 0 && (
          <p className="p-6 text-sm text-neutral-400">
            Aún no tienes productos. Crea el primero con "Nuevo producto".
          </p>
        )}
        {products.map((p) => {
          const cat = categories.find((c) => c.id === p.category_id);
          return (
            <ProductRow
              key={p.id}
              product={p}
              categoryName={cat?.name}
              restaurantId={restaurantId}
              onEdit={() => openEdit(p)}
            />
          );
        })}
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editing}
          categories={categories}
          restaurantId={restaurantId}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function ProductRow({
  product,
  categoryName,
  restaurantId,
  onEdit,
}: {
  product: Product;
  categoryName?: string;
  restaurantId: string;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleToggle(field: "is_offer" | "available" | "is_recommended", value: boolean) {
    startTransition(async () => {
      try {
        await toggleProductField(product.id, restaurantId, field, value);
        router.refresh();
      } catch (e: any) {
        toast.error(e.message ?? "Error");
      }
    });
  }

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      try {
        await deleteProduct(product.id, restaurantId);
        toast.success("Producto eliminado");
        router.refresh();
      } catch (e: any) {
        toast.error(e.message ?? "Error");
      }
    });
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
        {product.image_url && (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{product.name}</p>
        <p className="text-xs text-neutral-400">
          {categoryName ?? "Sin categoría"} · {formatPrice(product.offer_price ?? product.price)}
          {!product.available && <span className="text-red-500"> · sin publicar</span>}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          title="Oferta del día"
          aria-label={product.is_offer ? "Quitar de ofertas del día" : "Marcar como oferta del día"}
          aria-pressed={product.is_offer}
          onClick={() => handleToggle("is_offer", !product.is_offer)}
          className={cn(
            "p-2 rounded-lg",
            product.is_offer ? "bg-amber-100 text-amber-700" : "text-neutral-300 hover:bg-neutral-100"
          )}
        >
          <Tag size={16} />
        </button>
        <button
          title="Recomendado"
          aria-label={product.is_recommended ? "Quitar recomendación del chef" : "Marcar como recomendación del chef"}
          aria-pressed={product.is_recommended}
          onClick={() => handleToggle("is_recommended", !product.is_recommended)}
          className={cn(
            "p-2 rounded-lg",
            product.is_recommended ? "bg-purple-100 text-purple-700" : "text-neutral-300 hover:bg-neutral-100"
          )}
        >
          <ChefHat size={16} />
        </button>
        <button
          title={product.available ? "Despublicar (ocultar del menú)" : "Publicar (mostrar en el menú)"}
          aria-label={product.available ? "Despublicar producto" : "Publicar producto"}
          aria-pressed={product.available}
          onClick={() => handleToggle("available", !product.available)}
          className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100"
        >
          {product.available ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          onClick={onEdit}
          aria-label={`Editar ${product.name}`}
          className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          aria-label={confirming ? "Confirmar eliminación" : `Eliminar ${product.name}`}
          className={cn(
            "p-2 rounded-lg",
            confirming ? "bg-red-500 text-white" : "text-neutral-400 hover:bg-neutral-100"
          )}
          title={confirming ? "Click de nuevo para confirmar" : "Eliminar"}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
