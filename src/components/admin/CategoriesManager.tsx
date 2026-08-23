"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  upsertCategory,
  deleteCategory,
  reorderCategory,
  toggleCategoryVisible,
} from "@/app/admin/actions";
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Pencil, Check, X } from "lucide-react";
import type { Category } from "@/types";

export default function CategoriesManager({
  categories,
  restaurantId,
}: {
  categories: Category[];
  restaurantId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const fd = new FormData();
    fd.set("name", name);
    fd.set("restaurant_id", restaurantId);
    startTransition(async () => {
      try {
        await upsertCategory(fd);
        setName("");
        toast.success("Categoría creada");
        router.refresh();
      } catch (e: any) {
        toast.error(e.message ?? "Error");
      }
    });
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditingName(cat.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  function saveEdit(cat: Category) {
    if (!editingName.trim()) return;
    const fd = new FormData();
    fd.set("id", cat.id);
    fd.set("name", editingName.trim());
    fd.set("restaurant_id", restaurantId);
    startTransition(async () => {
      try {
        await upsertCategory(fd);
        toast.success("Categoría actualizada");
        setEditingId(null);
        router.refresh();
      } catch (e: any) {
        toast.error(e.message ?? "Error");
      }
    });
  }

  function move(cat: Category, direction: -1 | 1) {
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapWith = sorted[idx + direction];
    if (!swapWith) return;
    startTransition(async () => {
      await reorderCategory(cat.id, restaurantId, swapWith.sort_order);
      await reorderCategory(swapWith.id, restaurantId, cat.sort_order);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Categorías</h2>
        <p className="text-neutral-500 text-sm">
          Organiza tu menú (Entrantes, Platos principales, Postres, Bebidas...).
          Haz clic en el lápiz para renombrar una categoría existente.
        </p>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la categoría"
          aria-label="Nombre de la nueva categoría"
          className="flex-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
        />
        <button
          disabled={isPending}
          className="bg-black text-white rounded-xl px-4 flex items-center gap-1.5 text-sm disabled:opacity-60"
        >
          <Plus size={16} /> Añadir
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
        {sorted.length === 0 && (
          <p className="p-6 text-sm text-neutral-400">Aún no hay categorías.</p>
        )}
        {sorted.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 p-4">
            {editingId === cat.id ? (
              <>
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(cat);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  aria-label={`Editar nombre de ${cat.name}`}
                  className="flex-1 border border-neutral-300 rounded-lg px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => saveEdit(cat)}
                  disabled={isPending}
                  aria-label="Guardar nombre"
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={cancelEdit}
                  aria-label="Cancelar edición"
                  className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium">{cat.name}</span>
                <button
                  onClick={() => startEdit(cat)}
                  aria-label={`Editar ${cat.name}`}
                  className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => move(cat, -1)}
                  aria-label={`Mover ${cat.name} hacia arriba`}
                  className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  onClick={() => move(cat, 1)}
                  aria-label={`Mover ${cat.name} hacia abajo`}
                  className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      await toggleCategoryVisible(cat.id, restaurantId, !cat.visible);
                      router.refresh();
                    })
                  }
                  aria-label={cat.visible ? `Ocultar ${cat.name}` : `Mostrar ${cat.name}`}
                  aria-pressed={cat.visible}
                  className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  {cat.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteCategory(cat.id, restaurantId);
                      toast.success("Categoría eliminada");
                      router.refresh();
                    })
                  }
                  aria-label={`Eliminar ${cat.name}`}
                  className="p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 rounded-lg"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
