import Image from "next/image";
import type { Section } from "@/types";

export function TextSection({ section }: { section: Section }) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-8 text-center">
      {section.title && <h2 className="text-xl font-semibold mb-2">{section.title}</h2>}
      {section.subtitle && <p className="text-text/60 mb-3">{section.subtitle}</p>}
      {section.content?.body && (
        <p className="text-sm text-text/70 whitespace-pre-line">{section.content.body}</p>
      )}
    </section>
  );
}

export function GallerySection({ section }: { section: Section }) {
  const images: string[] = section.content?.images ?? [];
  if (images.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-6 py-8">
      {section.title && <h2 className="text-xl font-semibold mb-4 text-center">{section.title}</h2>}
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-theme overflow-hidden">
            <Image src={src} alt={`Galería ${i + 1}`} fill className="object-cover" sizes="200px" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactSection({ section }: { section: Section }) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-8 text-center">
      <h2 className="text-xl font-semibold mb-2">{section.title || "Contacto y reservas"}</h2>
      {section.content?.phone && (
        <a
          href={`tel:${section.content.phone}`}
          className="inline-block mt-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm"
        >
          Llamar para reservar
        </a>
      )}
    </section>
  );
}
