"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImageToStorage } from "@/app/admin/actions";
import { ImagePlus, Loader2 } from "lucide-react";

export default function ImageUploader({
  name,
  initialUrl,
  folder,
  restaurantId,
  label,
  round = false,
}: {
  name: string; // nombre del input hidden que guarda la URL final
  initialUrl?: string | null;
  folder: string; // carpeta dentro del bucket
  restaurantId: string;
  label?: string;
  round?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}.${ext}`;
      try {
        const url = await uploadImageToStorage(base64, path, restaurantId);
        setPreview(url);
      } catch (err: any) {
        setError(err.message ?? "Error al subir la imagen");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {label && <label className="text-xs text-neutral-500 block mb-1">{label}</label>}
      <div className="flex items-center gap-3">
        <div
          className={`relative w-20 h-20 overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 ${round ? "rounded-full" : "rounded-xl"}`}
        >
          {loading ? (
            <Loader2 className="animate-spin text-neutral-400" size={20} />
          ) : preview ? (
            <Image src={preview} alt={label ?? "preview"} fill className="object-cover" />
          ) : (
            <ImagePlus className="text-neutral-300" size={20} />
          )}
        </div>
        <label className="text-sm px-3 py-2 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50">
          Subir imagen
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        <input type="hidden" name={name} value={preview ?? ""} />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
