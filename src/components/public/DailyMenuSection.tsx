import type { Section, DailyMenuCourse } from "@/types";
import { UtensilsCrossed } from "lucide-react";

export default function DailyMenuSection({ section }: { section: Section }) {
  const courses: DailyMenuCourse[] = section.content?.courses ?? [];
  const price: string = section.content?.price ?? "";

  if (courses.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-6 py-10">
      <div className="rounded-theme border border-primary/10 bg-neutral-50 p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <UtensilsCrossed size={20} className="text-secondary" />
            {section.title || "Menú del día"}
          </h2>
          {price && (
            <span className="text-lg font-semibold text-secondary">{price} €</span>
          )}
        </div>
        {section.subtitle && (
          <p className="text-sm text-text/60 mb-6">{section.subtitle}</p>
        )}

        <div className="flex flex-col gap-6 mt-4">
          {courses.map((course, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2 flex items-center gap-2">
                {course.name}
                {!course.required && (
                  <span className="text-[10px] font-normal normal-case text-text/40 bg-black/5 px-2 py-0.5 rounded-full">
                    opcional
                  </span>
                )}
              </h3>
              {course.options.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {course.options.map((opt, j) => (
                    <li key={j} className="text-sm text-text/80 pl-3 border-l-2 border-secondary/30">
                      {opt}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text/40 italic">Próximamente</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
