"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface ResultadoImportacion {
  total: number;
  creadas: number;
  errores: { fila: number; motivo: string }[];
}

export default function ImportarBateriasPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      setError("Selecciona un archivo Excel (.xlsx).");
      return;
    }
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("file", archivo);
      const res = await fetch("/api/admin/baterias/importar", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al importar.");
      setResultado(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al importar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-condensed text-3xl font-black text-sand-100 uppercase mb-2">Importar baterías desde Excel</h1>
      <p className="text-sand-100/40 text-sm mb-8">
        Sube un archivo .xlsx con una fila por batería. Solo <strong className="text-gold-light">modelo</strong> e{" "}
        <strong className="text-gold-light">imagen</strong> (URL de la imagen) son obligatorios — el resto puede quedar vacío.
      </p>

      <div className="bg-ink-800 border border-gold/15 rounded-2xl p-6 mb-6">
        <p className="text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-3">
          Columnas esperadas (cabecera en la primera fila)
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs text-sand-100/70 w-full">
            <thead>
              <tr className="text-gold-light">
                <th className="text-left pr-4 pb-2">modelo *</th>
                <th className="text-left pr-4 pb-2">imagen *</th>
                <th className="text-left pr-4 pb-2">marca</th>
                <th className="text-left pr-4 pb-2">precio</th>
                <th className="text-left pr-4 pb-2">amperaje</th>
                <th className="text-left pb-2">start_stop</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sand-100/40">
                <td className="pr-4">Tudor TA640</td>
                <td className="pr-4">https://.../ta640.jpg</td>
                <td className="pr-4">Tudor</td>
                <td className="pr-4">89.90</td>
                <td className="pr-4">64</td>
                <td>si</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-sand-100/30 mt-3">
          "imagen" acepta también "imagen_url" o "url_imagen". "start_stop" acepta también "arranque_parada" (valores: si/no, true/false, 1/0).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-ink-800 border border-gold/15 rounded-2xl p-7 space-y-5">
        <div>
          <label className="block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-2">
            Archivo Excel (.xlsx)
          </label>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="block w-full text-sm text-sand-100/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-gold file:text-ink-900 file:font-semibold file:cursor-pointer"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gold hover:bg-gold-light disabled:opacity-50 text-ink-900 font-condensed font-black uppercase text-sm rounded-xl transition-colors"
        >
          {loading ? "Importando..." : "Importar"}
        </button>
      </form>

      {resultado && (
        <div className="mt-6 bg-ink-800 border border-gold/15 rounded-2xl p-6">
          <p className="text-sand-100 font-semibold mb-2">
            {resultado.creadas} de {resultado.total} baterías creadas correctamente.
          </p>
          {resultado.errores.length > 0 && (
            <div className="mt-3">
              <p className="text-red-400 text-sm font-semibold mb-2">Filas con error:</p>
              <ul className="space-y-1 text-sm text-red-300/80">
                {resultado.errores.map((e) => (
                  <li key={e.fila}>Fila {e.fila}: {e.motivo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
