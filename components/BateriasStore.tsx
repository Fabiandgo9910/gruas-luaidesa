"use client";
import { useMemo, useState } from "react";
import BateriaCard from "@/components/BateriaCard";
import CocheBateriaModal from "@/components/CocheBateriaModal";
import type { Bateria } from "@/lib/supabase";

export default function BateriasStore({ baterias }: { baterias: Bateria[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [marca, setMarca] = useState("todas");
  const [amperaje, setAmperaje] = useState("todos");
  const [soloStartStop, setSoloStartStop] = useState(false);

  const marcas = useMemo(
    () => Array.from(new Set(baterias.map((b) => b.marca).filter(Boolean))).sort() as string[],
    [baterias]
  );

  const rangosAmperaje = [
    { value: "todos", label: "Cualquier amperaje" },
    { value: "0-45", label: "Hasta 45 Ah" },
    { value: "45-60", label: "45–60 Ah" },
    { value: "60-75", label: "60–75 Ah" },
    { value: "75-999", label: "Más de 75 Ah" },
  ];

  const filtradas = useMemo(() => {
    return baterias.filter((b) => {
      if (busqueda && !`${b.marca || ""} ${b.modelo}`.toLowerCase().includes(busqueda.toLowerCase())) {
        return false;
      }
      if (marca !== "todas" && b.marca !== marca) return false;
      if (soloStartStop && !b.start_stop) return false;
      if (amperaje !== "todos" && b.amperaje) {
        const [min, max] = amperaje.split("-").map(Number);
        if (b.amperaje < min || b.amperaje > max) return false;
      }
      return true;
    });
  }, [baterias, busqueda, marca, amperaje, soloStartStop]);

  const selectClass =
    "bg-ink-800 border border-gold/20 rounded-xl px-4 py-2.5 text-sand-100 text-sm focus:outline-none focus:border-gold";

  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por modelo o marca..."
          className="flex-1 min-w-[200px] bg-ink-800 border border-gold/20 rounded-xl px-4 py-2.5 text-sand-100 placeholder-sand-100/30 text-sm focus:outline-none focus:border-gold"
        />
        <select value={marca} onChange={(e) => setMarca(e.target.value)} className={selectClass}>
          <option value="todas">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={amperaje} onChange={(e) => setAmperaje(e.target.value)} className={selectClass}>
          {rangosAmperaje.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sand-100 text-sm bg-ink-800 border border-gold/20 rounded-xl px-4 py-2.5 cursor-pointer">
          <input
            type="checkbox" checked={soloStartStop} onChange={(e) => setSoloStartStop(e.target.checked)}
            className="w-4 h-4 accent-[#C9A227]"
          />
          Solo Start-Stop
        </label>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
        <CocheBateriaModal />
        <a
          href="https://www.exidegroup.com/es/es/brand/tudor"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border-2 border-gold/30 hover:border-gold text-sand-100 font-condensed font-black uppercase tracking-wide rounded-full px-6 py-3.5 transition-all text-sm sm:text-base"
        >
          Saber qué batería lleva mi coche por la matrícula
        </a>
      </div>

      {filtradas.length === 0 ? (
        <div className="bg-ink-800 border border-gold/15 rounded-2xl p-10 text-center">
          <p className="text-sand-100/50">No hay baterías que coincidan con estos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtradas.map((b) => (
            <BateriaCard key={b.id} bateria={b} />
          ))}
        </div>
      )}
    </div>
  );
}
