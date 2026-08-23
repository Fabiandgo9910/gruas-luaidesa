"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, ExternalLink, Smartphone, Monitor, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LivePreview({ slug, isActive }: { slug: string; isActive: boolean }) {
  const [reloadKey, setReloadKey] = useState(0);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">Vista previa en vivo</h2>
          <p className="text-neutral-500 text-sm">
            Así se ve tu menú público ahora mismo. Guarda cambios en otra
            pestaña y pulsa "Actualizar" para verlos aquí.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setDevice("mobile")}
              aria-label="Vista móvil"
              aria-pressed={device === "mobile"}
              className={cn(
                "p-2 rounded-lg",
                device === "mobile" ? "bg-white shadow-sm" : "text-neutral-400"
              )}
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={() => setDevice("desktop")}
              aria-label="Vista escritorio"
              aria-pressed={device === "desktop"}
              className={cn(
                "p-2 rounded-lg",
                device === "desktop" ? "bg-white shadow-sm" : "text-neutral-400"
              )}
            >
              <Monitor size={16} />
            </button>
          </div>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-sm hover:bg-neutral-50"
          >
            <RefreshCw size={14} /> Actualizar
          </button>
          <Link
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black text-white text-sm"
          >
            Abrir en pestaña nueva <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {!isActive && (
        <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>
            Este restaurante está <strong>desactivado</strong> — nadie puede
            verlo públicamente todavía, ni siquiera aquí en la vista previa.
            Actívalo en la pestaña <strong>General</strong> ("Restaurante
            activo") para poder previsualizarlo y publicarlo.
          </p>
        </div>
      )}

      <div className="bg-neutral-100 rounded-2xl p-4 md:p-8 flex justify-center">
        <div
          className={cn(
            "bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 transition-all",
            device === "mobile" ? "w-[390px] h-[780px]" : "w-full h-[780px]"
          )}
        >
          <iframe
            key={reloadKey}
            src={`/${slug}`}
            title="Vista previa del menú público"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
