"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  addSection,
  updateSection,
  toggleSectionVisible,
  reorderSection,
  deleteSection,
} from "@/app/admin/actions";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  GripVertical,
  ChevronDown,
  X,
} from "lucide-react";
import type { Section, SectionType, DailyMenuCourse } from "@/types";

const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Portada / Banner principal",
  categories: "Menú por categorías",
  offers: "Ofertas del día",
  recommended: "Recomendaciones del chef",
  gallery: "Galería de fotos",
  text: "Bloque de texto libre",
  contact: "Contacto y reservas",
  custom: "Sección personalizada",
  daily_menu: "Menú del día",
};

const UNIQUE_TYPES: SectionType[] = [
  "hero",
  "categories",
  "offers",
  "recommended",
  "contact",
  "daily_menu",
];
const REPEATABLE_TYPES: SectionType[] = ["text", "gallery", "custom"];

const DEFAULT_COURSES: DailyMenuCourse[] = [
  { name: "Primero", required: true, options: [] },
  { name: "Segundo", required: false, options: [] },
  { name: "Principal", required: true, options: [] },
  { name: "Postre o café", required: true, options: [] },
];

export default function SectionsManager({
  restaurantId,
  sections,
}: {
  restaurantId: string;
  sections: Section[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  const usedUniqueTypes = new Set(sorted.map((s) => s.type));
  const availableToAdd = [
    ...UNIQUE_TYPES.filter((t) => !usedUniqueTypes.has(t)),
    ...REPEATABLE_TYPES,
  ];

  function move(section: Section, direction: -1 | 1) {
    const idx = sorted.findIndex((s) => s.id === section.id);
    const swapWith = sorted[idx + direction];
    if (!swapWith) return;
    startTransition(async () => {
      await reorderSection(section.id, swapWith.sort_order, restaurantId);
      await reorderSection(swapWith.id, section.sort_order, restaurantId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Activa, desactiva, reordena o elimina las secciones de la página pública.
        </p>
        <AddSectionMenu
          options={availableToAdd}
          onAdd={(type) =>
            startTransition(async () => {
              await addSection(restaurantId, type);
              toast.success("Sección añadida");
              router.refresh();
            })
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            restaurantId={restaurantId}
            onMoveUp={() => move(section, -1)}
            onMoveDown={() => move(section, 1)}
          />
        ))}
      </div>
    </div>
  );
}

function AddSectionMenu({
  options,
  onAdd,
}: {
  options: SectionType[];
  onAdd: (type: SectionType) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-black text-white rounded-xl px-4 py-2.5 text-sm"
      >
        <Plus size={16} /> Añadir sección <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 w-64 overflow-hidden">
          {options.length === 0 && (
            <p className="p-3 text-xs text-neutral-400">Ya añadiste todas las secciones únicas.</p>
          )}
          {options.map((type) => (
            <button
              key={type}
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50"
            >
              {SECTION_LABELS[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionCard({
  section,
  restaurantId,
  onMoveUp,
  onMoveDown,
}: {
  section: Section;
  restaurantId: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Estado local del contenido específico según tipo
  const [body, setBody] = useState(section.content?.body ?? "");
  const [phone, setPhone] = useState(section.content?.phone ?? "");
  const [images, setImages] = useState((section.content?.images ?? []).join("\n"));
  const [price, setPrice] = useState(section.content?.price ?? "");
  const [courses, setCourses] = useState<DailyMenuCourse[]>(
    section.content?.courses?.length ? section.content.courses : DEFAULT_COURSES
  );

  function updateCourse(index: number, patch: Partial<DailyMenuCourse>) {
    setCourses((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function removeCourse(index: number) {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  }

  function addCourse() {
    setCourses((prev) => [...prev, { name: "", required: true, options: [] }]);
  }

  async function handleSave(formData: FormData) {
    setSaving(true);
    let content: Record<string, any> = {};
    if (section.type === "text") content = { body };
    if (section.type === "contact") content = { phone };
    if (section.type === "gallery") {
      content = { images: images.split("\n").map((s: string) => s.trim()).filter(Boolean) };
    }
    if (section.type === "daily_menu") {
      content = {
        price,
        courses: courses
          .filter((c) => c.name.trim())
          .map((c) => ({ ...c, name: c.name.trim() })),
      };
    }
    formData.set("content", JSON.stringify(content));
    formData.set("id", section.id);
    formData.set("restaurant_id", restaurantId);

    try {
      await updateSection(formData);
      toast.success("Sección actualizada");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100">
      <div className="flex items-center gap-2 p-4">
        <GripVertical size={16} className="text-neutral-300" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{SECTION_LABELS[section.type]}</p>
          {section.title && <p className="text-xs text-neutral-400 truncate">{section.title}</p>}
        </div>
        <button onClick={onMoveUp} aria-label="Mover arriba" className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg">
          <ArrowUp size={15} />
        </button>
        <button onClick={onMoveDown} aria-label="Mover abajo" className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg">
          <ArrowDown size={15} />
        </button>
        <button
          onClick={() =>
            startTransition(async () => {
              await toggleSectionVisible(section.id, restaurantId, !section.visible);
              router.refresh();
            })
          }
          className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg"
          title={section.visible ? "Ocultar sección" : "Mostrar sección"}
          aria-label={section.visible ? "Ocultar sección" : "Mostrar sección"}
          aria-pressed={section.visible}
        >
          {section.visible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button
          onClick={() =>
            startTransition(async () => {
              await deleteSection(section.id, restaurantId);
              toast.success("Sección eliminada");
              router.refresh();
            })
          }
          aria-label="Eliminar sección"
          className="p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 rounded-lg"
        >
          <Trash2 size={15} />
        </button>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200"
        >
          {expanded ? "Cerrar" : "Editar"}
        </button>
      </div>

      {expanded && (
        <form action={handleSave} className="border-t border-neutral-100 p-4 flex flex-col gap-3">
          <div>
            <label className="text-xs text-neutral-500">Título</label>
            <input
              name="title"
              defaultValue={section.title}
              className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500">Subtítulo</label>
            <input
              name="subtitle"
              defaultValue={section.subtitle}
              className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm"
            />
          </div>

          {section.type === "text" && (
            <div>
              <label className="text-xs text-neutral-500">Texto</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm"
              />
            </div>
          )}

          {section.type === "contact" && (
            <div>
              <label className="text-xs text-neutral-500">Teléfono de reservas</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm"
              />
            </div>
          )}

          {section.type === "gallery" && (
            <div>
              <label className="text-xs text-neutral-500">URLs de imágenes (una por línea)</label>
              <textarea
                value={images}
                onChange={(e) => setImages(e.target.value)}
                rows={4}
                placeholder="https://..."
                className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm"
              />
            </div>
          )}

          {section.type === "daily_menu" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-neutral-500">Precio (opcional, ej: 14.90)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="14.90"
                  className="w-full mt-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col gap-3">
                {courses.map((course, i) => (
                  <div key={i} className="border border-neutral-200 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={course.name}
                        onChange={(e) => updateCourse(i, { name: e.target.value })}
                        placeholder="Nombre del tiempo (ej: Primero, Postre...)"
                        className="flex-1 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm font-medium"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-neutral-500 shrink-0 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={course.required}
                          onChange={(e) => updateCourse(i, { required: e.target.checked })}
                        />
                        Obligatorio
                      </label>
                      <button
                        type="button"
                        onClick={() => removeCourse(i)}
                        aria-label={`Quitar tiempo ${course.name || i + 1}`}
                        className="p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 rounded-lg shrink-0"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400">Platos a escoger (uno por línea)</label>
                      <textarea
                        value={course.options.join("\n")}
                        onChange={(e) =>
                          updateCourse(i, {
                            options: e.target.value.split("\n"),
                          })
                        }
                        rows={3}
                        placeholder={"Sopa de tomate\nEnsalada César"}
                        className="w-full mt-1 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCourse}
                  className="self-start flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                >
                  <Plus size={14} /> Añadir tiempo (ej: "Segundo", "Entrada")
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                Si un tiempo (por ejemplo "Segundo") no aplica siempre, quita
                la marca de "Obligatorio" o simplemente elimínalo con la X.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="self-start bg-black text-white rounded-xl px-4 py-2 text-sm disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar sección"}
          </button>
        </form>
      )}
    </div>
  );
}
