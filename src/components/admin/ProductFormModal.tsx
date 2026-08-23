"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { upsertProduct } from "@/app/admin/actions";
import ImageUploader from "./ImageUploader";
import MultiImageUploader from "./MultiImageUploader";
import { COMMON_ALLERGENS } from "@/lib/utils";
import type { Category, Product } from "@/types";

export default function ProductFormModal({
  product,
  categories,
  restaurantId,
  onClose,
  onSaved,
}: {
  product?: Product | null;
  categories: Category[];
  restaurantId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [isOffer, setIsOffer] = useState(product?.is_offer ?? false);

  // Bloquea el scroll del fondo mientras el modal está abierto, y permite
  // cerrarlo con la tecla Escape (evita que "se vea todo mezclado" al
  // desplazarse por detrás mientras el modal está abierto).
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    try {
      if (product?.id) formData.set("id", product.id);
      formData.set("restaurant_id", restaurantId);
      await upsertProduct(formData);
      toast.success(product ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch (e: any) {
      toast.error(e.message ?? "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] isolate bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Tarjeta: columna flex con alto máximo fijo. El header y el pie NO
          se mueven; solo el cuerpo del formulario hace scroll interno. Esto
          evita el problema de vistas que se superponen al desplazarse. */}
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 shrink-0">
          <h2 className="font-semibold">{product ? "Editar producto" : "Nuevo producto"}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-neutral-400 hover:text-black p-1 rounded-lg hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          id="product-form"
          action={handleSubmit}
          className="flex flex-col gap-5 p-5 overflow-y-auto flex-1 min-h-0"
        >
          <ImageUploader
            name="image_url"
            initialUrl={product?.image_url}
            folder={`productos/${restaurantId}`}
            restaurantId={restaurantId}
            label="Foto principal"
          />

          <MultiImageUploader
            name="gallery_images"
            initialUrls={product?.gallery_images}
            folder={`productos/${restaurantId}/galeria`}
            restaurantId={restaurantId}
            label="Fotos adicionales (se ven al abrir el detalle del producto)"
          />

          <div>
            <label htmlFor="product-name" className="text-xs text-neutral-500">Nombre</label>
            <input
              id="product-name"
              name="name"
              defaultValue={product?.name}
              required
              autoFocus
              className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="product-description" className="text-xs text-neutral-500">Descripción</label>
            <textarea
              id="product-description"
              name="description"
              defaultValue={product?.description}
              rows={3}
              className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-category" className="text-xs text-neutral-500">Categoría</label>
              <select
                id="product-category"
                name="category_id"
                defaultValue={product?.category_id ?? ""}
                className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white"
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Aún no tienes categorías — el producto igual se mostrará en el menú.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="product-price" className="text-xs text-neutral-500">Precio</label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                name="price"
                defaultValue={product?.price}
                required
                className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="product-ingredients" className="text-xs text-neutral-500">
              Ingredientes (separados por coma)
            </label>
            <input
              id="product-ingredients"
              name="ingredients"
              defaultValue={product?.ingredients?.join(", ")}
              placeholder="Tomate, queso, albahaca"
              className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <span className="text-xs text-neutral-500 mb-2 block">Alérgenos</span>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGENS.map((al) => (
                <label
                  key={al}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border border-neutral-200 cursor-pointer has-[:checked]:bg-black has-[:checked]:text-white"
                >
                  <input
                    type="checkbox"
                    name="allergens"
                    value={al}
                    defaultChecked={product?.allergens?.includes(al)}
                    className="hidden"
                  />
                  {al}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_offer"
                defaultChecked={product?.is_offer}
                onChange={(e) => setIsOffer(e.target.checked)}
              />
              Marcar como oferta del día
            </label>
            {isOffer && (
              <div>
                <label htmlFor="product-offer-price" className="text-xs text-neutral-500">
                  Precio de oferta
                </label>
                <input
                  id="product-offer-price"
                  type="number"
                  step="0.01"
                  name="offer_price"
                  defaultValue={product?.offer_price ?? ""}
                  className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_recommended" defaultChecked={product?.is_recommended} />
              Recomendación del chef
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="available" defaultChecked={product?.available ?? true} />
              Publicado (visible en el menú público)
            </label>
          </div>
        </form>

        <div className="flex gap-3 p-5 border-t border-neutral-100 shrink-0">
          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="bg-black text-white rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar producto"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
