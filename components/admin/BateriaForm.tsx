"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Bateria } from "@/lib/supabase";

const inputClass =
  "w-full bg-ink-900/60 border border-gold/20 rounded-xl px-4 py-3 text-sand-100 placeholder-sand-100/25 focus:outline-none focus:border-gold text-sm";
const labelClass = "block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1.5";

export default function BateriaForm({ bateria }: { bateria?: Bateria }) {
  const router = useRouter();
  const esEdicion = !!bateria;

  const [modelo, setModelo] = useState(bateria?.modelo || "");
  const [marca, setMarca] = useState(bateria?.marca || "");
  const [amperaje, setAmperaje] = useState(bateria?.amperaje?.toString() || "");
  const [precio, setPrecio] = useState(bateria?.precio?.toString() || "");
  const [startStop, setStartStop] = useState(bateria?.start_stop || false);
  const [publicado, setPublicado] = useState(bateria?.publicado ?? true);

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>(bateria?.imagen_url || "");

  const [loading, setLoading] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [error, setError] = useState("");

  const handleArchivo = (file: File | null) => {
    setImagenFile(file);
    if (file) setImagenPreview(URL.createObjectURL(file));
    else setImagenPreview(bateria?.imagen_url || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!modelo.trim()) {
      setError("El modelo es obligatorio.");
      return;
    }
    if (!imagenFile && !bateria?.imagen_url) {
      setError("La imagen es obligatoria.");
      return;
    }

    setLoading(true);
    try {
      let imagenUrl = bateria?.imagen_url || "";

      // Si se ha elegido un archivo nuevo, se sube primero al Storage
      // de Supabase y se usa la URL pública que devuelve.
      if (imagenFile) {
        setSubiendoImagen(true);
        const formData = new FormData();
        formData.append("file", imagenFile);
        const resSubida = await fetch("/api/admin/baterias/subir-imagen", {
          method: "POST",
          body: formData,
        });
        const dataSubida = await resSubida.json().catch(() => ({}));
        setSubiendoImagen(false);
        if (!resSubida.ok) throw new Error(dataSubida?.error || "Error al subir la imagen.");
        imagenUrl = dataSubida.url;
      }

      const payload = {
        modelo,
        marca: marca || null,
        amperaje: amperaje ? Number(amperaje) : null,
        precio: precio ? Number(precio) : null,
        start_stop: startStop,
        imagen_url: imagenUrl,
        publicado,
      };

      const res = await fetch(
        esEdicion ? `/api/admin/baterias/${bateria!.id}` : "/api/admin/baterias",
        {
          method: esEdicion ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Error al guardar.");

      router.push("/panel-control/baterias");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la batería.");
    } finally {
      setLoading(false);
      setSubiendoImagen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-ink-800 border border-gold/15 rounded-2xl p-7 space-y-5 max-w-xl">
      <div>
        <label className={labelClass}>Modelo *</label>
        <input value={modelo} onChange={(e) => setModelo(e.target.value)} className={inputClass} placeholder="Ej. Tudor TA640" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Marca</label>
          <input value={marca} onChange={(e) => setMarca(e.target.value)} className={inputClass} placeholder="Ej. Tudor" />
        </div>
        <div>
          <label className={labelClass}>Amperaje (Ah)</label>
          <input
            type="number" step="1" value={amperaje} onChange={(e) => setAmperaje(e.target.value)}
            className={inputClass} placeholder="Ej. 64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Precio (€)</label>
          <input
            type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)}
            className={inputClass} placeholder="Ej. 89.90"
          />
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2.5 text-sand-100 text-sm">
            <input
              type="checkbox" checked={startStop} onChange={(e) => setStartStop(e.target.checked)}
              className="w-4 h-4 accent-[#C9A227]"
            />
            Sistema Start-Stop
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Foto de la batería *</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => handleArchivo(e.target.files?.[0] || null)}
          className="block w-full text-sm text-sand-100/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-gold file:text-ink-900 file:font-semibold file:cursor-pointer"
        />
        <p className="text-[11px] text-sand-100/30 mt-1.5">JPG, PNG, WEBP o GIF. Máximo 5 MB.</p>
        {imagenPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagenPreview} alt="Vista previa" className="mt-3 w-24 h-24 object-cover rounded-lg border border-gold/20" />
        )}
        {esEdicion && !imagenFile && (
          <p className="text-[11px] text-sand-100/30 mt-1.5">Si no seleccionas un archivo nuevo, se mantiene la foto actual.</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2.5 text-sand-100 text-sm">
          <input
            type="checkbox" checked={publicado} onChange={(e) => setPublicado(e.target.checked)}
            className="w-4 h-4 accent-[#C9A227]"
          />
          Publicada (visible en la tienda)
        </label>
      </div>

      {error && (
        <p role="alert" className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gold hover:bg-gold-light disabled:opacity-50 text-ink-900 font-condensed font-black uppercase text-sm rounded-xl transition-colors"
        >
          {subiendoImagen ? "Subiendo imagen..." : loading ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear batería"}
        </button>
      </div>
    </form>
  );
}
