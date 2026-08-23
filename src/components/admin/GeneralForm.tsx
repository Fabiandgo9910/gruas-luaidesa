"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateRestaurantGeneral } from "@/app/admin/actions";
import ImageUploader from "./ImageUploader";
import type { Restaurant } from "@/types";

export default function GeneralForm({ restaurant }: { restaurant: Restaurant }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.set("id", restaurant.id);
    try {
      await updateRestaurantGeneral(formData);
      toast.success("Restaurante actualizado");
    } catch (e: any) {
      toast.error(e.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-neutral-500">Nombre del restaurante</label>
          <input
            name="name"
            defaultValue={restaurant.name}
            required
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500">URL (slug) — tuapp.com/[slug]</label>
          <input
            name="slug"
            defaultValue={restaurant.slug}
            required
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-500">Dominio propio (opcional, ej: menu.restaurante.com)</label>
        <input
          name="custom_domain"
          defaultValue={restaurant.custom_domain ?? ""}
          className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-500">Descripción (se muestra en el banner)</label>
        <textarea
          name="description"
          defaultValue={restaurant.description}
          rows={2}
          className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-neutral-500">Título SEO (pestaña del navegador)</label>
          <input
            name="meta_title"
            defaultValue={restaurant.meta_title}
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500">Descripción SEO</label>
          <input
            name="meta_description"
            defaultValue={restaurant.meta_description}
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-neutral-500">Dirección</label>
          <input
            name="address"
            defaultValue={restaurant.address}
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500">Horario</label>
          <input
            name="schedule"
            defaultValue={restaurant.schedule}
            placeholder="Lun-Dom 12:00-23:00"
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
        <ImageUploader
          name="logo_url"
          initialUrl={restaurant.logo_url}
          folder={`restaurantes/${restaurant.id}/branding`}
          restaurantId={restaurant.id}
          label="Logo"
          round
        />
        <ImageUploader
          name="favicon_url"
          initialUrl={restaurant.favicon_url}
          folder={`restaurantes/${restaurant.id}/branding`}
          restaurantId={restaurant.id}
          label="Favicon"
        />
        <ImageUploader
          name="cover_url"
          initialUrl={restaurant.cover_url}
          folder={`restaurantes/${restaurant.id}/branding`}
          restaurantId={restaurant.id}
          label="Foto de portada (banner)"
        />
      </div>

      <div>
        <p className="text-xs text-neutral-500 mb-2">Redes sociales</p>
        <div className="grid grid-cols-2 gap-3">
          <input name="instagram" placeholder="URL Instagram" defaultValue={restaurant.socials?.instagram} className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
          <input name="facebook" placeholder="URL Facebook" defaultValue={restaurant.socials?.facebook} className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
          <input name="whatsapp" placeholder="Número WhatsApp (34600000000)" defaultValue={restaurant.socials?.whatsapp} className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
          <input name="website" placeholder="Sitio web" defaultValue={restaurant.socials?.website} className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={restaurant.is_active} />
        Restaurante activo (visible públicamente)
      </label>

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-black text-white rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
