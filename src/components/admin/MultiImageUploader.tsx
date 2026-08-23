"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImageToStorage } from "@/app/admin/actions";
import { ImagePlus, Loader2, X } from "lucide-react";

export default function MultiImageUploader({
  name,
  initialUrls,
  folder,
  restaurantId,
  label,
  max = 6,
}: {
  name: string; // input hidden que guarda el JSON del arreglo de URLs
  initialUrls?: string[] | null;
  folder: string;
  restaurantId: string;
  label?: string;
  max?: number;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (urls.length >= max) {
      setError(`Máximo ${max} imágenes secundarias.`);
      return;
    }

    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}.${ext}`;
      try {
        const url = await uploadImageToStorage(base64, path, restaurantId);
        setUrls((prev) => [...prev, url]);
      } catch (err: any) {
        setError(err.message ?? "Error al subir la imagen");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label && <label className="text-xs text-neutral-500 block mb-1">{label}</label>}
      <div className="flex flex-wrap items-center gap-3">
        {urls.map((url, i) => (
          <div
            key={url + i}
            className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group"
          >
            <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Quitar imagen ${i + 1}`}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {urls.length < max && (
          <label className="w-20 h-20 rounded-xl border border-dashed border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-50 shrink-0">
            {loading ? (
              <Loader2 className="animate-spin text-neutral-400" size={18} />
            ) : (
              <ImagePlus className="text-neutral-300" size={18} />
            )}
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
    </div>
  );
}
