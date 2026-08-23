import Image from "next/image";
import { Clock } from "lucide-react";
import type { Restaurant, Section } from "@/types";

export default function Banner({
  restaurant,
  hero,
}: {
  restaurant: Restaurant;
  hero?: Section;
}) {
  const title = hero?.title || restaurant.name;
  const subtitle = hero?.subtitle || restaurant.description;

  return (
    <header className="relative w-full h-[50vh] min-h-[340px] max-h-[520px] overflow-hidden rounded-b-theme">
      {restaurant.cover_url ? (
        <Image
          src={restaurant.cover_url}
          alt={restaurant.name}
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-primary) / 0.7) 100%)`,
          }}
        />
      )}
      {/* Scrim degradado: sutil arriba, oscuro abajo, para que el texto
          siempre sea legible sin tapar toda la foto (look actual de apps
          de delivery/reservas). */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-9 px-6 text-center gap-3">
        {restaurant.logo_url && (
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/90 bg-white shadow-lg">
            <Image
              src={restaurant.logo_url}
              alt={`Logo ${restaurant.name}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-semibold text-white drop-shadow-sm animate-fadeIn tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/90 max-w-lg text-sm md:text-base animate-fadeIn">
            {subtitle}
          </p>
        )}
        {restaurant.schedule && (
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/85 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
            <Clock size={12} /> {restaurant.schedule}
          </span>
        )}
      </div>
    </header>
  );
}
