"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";
import { createRestaurant } from "@/app/admin/actions";
import { slugifyBasic } from "@/lib/utils";

export default function NewRestaurantButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("slug", slugifyBasic(name));
      const id = await createRestaurant(fd);
      toast.success("Restaurante creado");
      setOpen(false);
      router.push(`/admin/restaurantes/${id}`);
    } catch (err: any) {
      toast.error(err.message ?? "Error al crear");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-black text-white rounded-xl px-4 py-2.5 text-sm"
      >
        <Plus size={16} /> Nuevo restaurante
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] isolate bg-black/50 flex items-center justify-center px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-neutral-400 p-1 rounded-lg hover:bg-neutral-100"
            >
              <X size={18} />
            </button>
            <h2 className="font-semibold mb-4">Nuevo restaurante</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <label htmlFor="new-restaurant-name" className="sr-only">
                Nombre del restaurante
              </label>
              <input
                id="new-restaurant-name"
                autoFocus
                required
                placeholder="Nombre del restaurante"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
              />
              {name && (
                <p className="text-xs text-neutral-400">
                  URL: /{slugifyBasic(name)} (editable después)
                </p>
              )}
              <button
                disabled={saving}
                className="bg-black text-white rounded-xl py-2.5 text-sm disabled:opacity-60"
              >
                {saving ? "Creando..." : "Crear restaurante"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
