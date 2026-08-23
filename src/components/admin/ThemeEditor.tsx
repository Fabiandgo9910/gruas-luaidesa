"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateRestaurantTheme } from "@/app/admin/actions";
import type { Restaurant } from "@/types";

const FONT_OPTIONS = [
  { label: "Inter (moderna, neutra)", value: "Inter" },
  { label: "Playfair Display (elegante, serif)", value: "Playfair Display" },
  { label: "Poppins (redondeada, cercana)", value: "Poppins" },
  { label: "DM Serif Display (clásica)", value: "DM Serif Display" },
  { label: "Space Grotesk (moderna, técnica)", value: "Space Grotesk" },
];

const RADIUS_OPTIONS = [
  { label: "Recto (0px)", value: "0px" },
  { label: "Suave (0.5rem)", value: "0.5rem" },
  { label: "Redondeado (1rem)", value: "1rem" },
  { label: "Muy redondeado (1.75rem)", value: "1.75rem" },
];

export default function ThemeEditor({ restaurant }: { restaurant: Restaurant }) {
  const [theme, setTheme] = useState(restaurant.theme);
  const [saving, setSaving] = useState(false);

  function update(field: keyof typeof theme, value: string) {
    setTheme((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateRestaurantTheme(restaurant.id, theme as any);
      toast.success("Tema actualizado");
    } catch (e: any) {
      toast.error(e.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <ColorField
            label="Color primario (textos/botones)"
            value={theme.primaryColor}
            onChange={(v) => update("primaryColor", v)}
          />
          <ColorField
            label="Color secundario (acentos, ofertas)"
            value={theme.secondaryColor}
            onChange={(v) => update("secondaryColor", v)}
          />
          <ColorField
            label="Fondo"
            value={theme.backgroundColor}
            onChange={(v) => update("backgroundColor", v)}
          />
          <ColorField
            label="Texto"
            value={theme.textColor}
            onChange={(v) => update("textColor", v)}
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500">Tipografía</label>
          <select
            value={theme.font}
            onChange={(e) => update("font", e.target.value)}
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-neutral-500">Estilo de bordes</label>
          <select
            value={theme.radius}
            onChange={(e) => update("radius", e.target.value)}
            className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start bg-black text-white rounded-xl px-5 py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar tema"}
        </button>
      </div>

      {/* Preview en vivo */}
      <div
        className="rounded-2xl border border-neutral-200 p-6 flex flex-col items-center justify-center gap-3 text-center"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.font,
        }}
      >
        <p className="text-xs uppercase tracking-wide opacity-50">Vista previa</p>
        <h3 className="text-2xl font-semibold" style={{ color: theme.primaryColor }}>
          {restaurant.name}
        </h3>
        <p className="text-sm opacity-70 max-w-xs">
          {restaurant.description || "Descripción del restaurante de ejemplo."}
        </p>
        <div
          className="mt-2 px-4 py-2 text-sm text-white"
          style={{ backgroundColor: theme.secondaryColor, borderRadius: theme.radius }}
        >
          Oferta del día
        </div>
        <div
          className="w-full mt-3 p-3 text-left text-sm"
          style={{ borderRadius: theme.radius, border: `1px solid ${theme.primaryColor}22` }}
        >
          <p className="font-medium">Plato de ejemplo</p>
          <p className="opacity-60 text-xs">Descripción breve del plato</p>
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-neutral-500">{label}</label>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg border border-neutral-200 cursor-pointer"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
        />
      </div>
    </div>
  );
}
