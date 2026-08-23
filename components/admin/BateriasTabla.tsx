"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Bateria } from "@/lib/supabase";

export default function BateriasTabla({ baterias }: { baterias: Bateria[] }) {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const todasSeleccionadas = baterias.length > 0 && seleccion.size === baterias.length;

  const toggleTodas = () => {
    setSeleccion(todasSeleccionadas ? new Set() : new Set(baterias.map((b) => b.id)));
  };

  const toggleUna = (id: string) => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePublicado = async (bateria: Bateria) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/baterias/${bateria.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicado: !bateria.publicado }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("No se pudo actualizar el estado de publicación.");
    }
  };

  const eliminarUna = async (id: string) => {
    if (!confirm("¿Eliminar esta batería? Esta acción no se puede deshacer.")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/baterias/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("No se pudo eliminar la batería.");
    }
  };

  const eliminarSeleccion = async () => {
    if (seleccion.size === 0) return;
    if (!confirm(`¿Eliminar ${seleccion.size} batería(s) seleccionada(s)? Esta acción no se puede deshacer.`)) return;
    setCargando(true);
    setError("");
    try {
      const res = await fetch("/api/admin/baterias/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(seleccion) }),
      });
      if (!res.ok) throw new Error();
      setSeleccion(new Set());
      router.refresh();
    } catch {
      setError("No se pudieron eliminar las baterías seleccionadas.");
    } finally {
      setCargando(false);
    }
  };

  if (baterias.length === 0) {
    return (
      <div className="bg-ink-800 border border-gold/15 rounded-2xl p-10 text-center">
        <p className="text-sand-100/50">Todavía no hay baterías. Crea la primera o importa un Excel.</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm mb-4">{error}</div>
      )}

      {seleccion.size > 0 && (
        <div className="flex items-center justify-between bg-ink-800 border border-gold/25 rounded-xl px-5 py-3 mb-4">
          <p className="text-sand-100/70 text-sm">{seleccion.size} seleccionada(s)</p>
          <button
            onClick={eliminarSeleccion}
            disabled={cargando}
            className="text-sm font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            Eliminar seleccionadas
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-ink-800 border border-gold/15 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left text-[11px] uppercase tracking-wider text-gold-dark">
              <th className="p-4 w-10">
                <input type="checkbox" checked={todasSeleccionadas} onChange={toggleTodas} className="accent-[#C9A227]" />
              </th>
              <th className="p-4">Imagen</th>
              <th className="p-4">Modelo</th>
              <th className="p-4">Marca</th>
              <th className="p-4">Amperaje</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Start-Stop</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {baterias.map((b) => (
              <tr key={b.id} className="border-b border-sand-100/5 last:border-0">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={seleccion.has(b.id)}
                    onChange={() => toggleUna(b.id)}
                    className="accent-[#C9A227]"
                  />
                </td>
                <td className="p-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-ink-900 border border-sand-100/10 relative">
                    {b.imagen_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.imagen_url} alt={b.modelo} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                </td>
                <td className="p-4 text-sand-100 font-medium">{b.modelo}</td>
                <td className="p-4 text-sand-100/60">{b.marca || "—"}</td>
                <td className="p-4 text-sand-100/60">{b.amperaje ? `${b.amperaje} Ah` : "—"}</td>
                <td className="p-4 text-sand-100/60">{b.precio ? `${b.precio} €` : "—"}</td>
                <td className="p-4 text-sand-100/60">{b.start_stop ? "Sí" : "No"}</td>
                <td className="p-4">
                  <button
                    onClick={() => togglePublicado(b)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                      b.publicado
                        ? "border-whatsapp/40 text-whatsapp"
                        : "border-sand-100/20 text-sand-100/40"
                    }`}
                  >
                    {b.publicado ? "Publicada" : "Oculta"}
                  </button>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  <Link
                    href={`/panel-control/baterias/${b.id}/editar`}
                    className="text-gold hover:text-gold-light text-xs font-semibold mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminarUna(b.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
