"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="w-full aspect-square bg-neutral-100 rounded-theme" />;
  }

  return (
    <div>
      <div className="relative w-full aspect-square rounded-theme overflow-hidden bg-neutral-100">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          className="object-cover animate-fadeIn"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-none">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1} de ${alt}`}
              aria-current={active === i}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                active === i ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
