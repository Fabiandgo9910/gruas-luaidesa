import { Instagram, Facebook, Phone, Globe, MapPin, Clock } from "lucide-react";
import type { Restaurant } from "@/types";

export default function Footer({ restaurant }: { restaurant: Restaurant }) {
  const s = restaurant.socials || {};

  return (
    <footer className="mt-16 border-t border-black/10 py-10 px-6 text-sm text-text/70">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 text-center">
        <p className="font-medium text-text">{restaurant.name}</p>

        {restaurant.address && (
          <p className="flex items-center gap-1.5">
            <MapPin size={14} /> {restaurant.address}
          </p>
        )}
        {restaurant.schedule && (
          <p className="flex items-center gap-1.5">
            <Clock size={14} /> {restaurant.schedule}
          </p>
        )}

        <div className="flex items-center gap-4 mt-1">
          {s.instagram && (
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          )}
          {s.facebook && (
            <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          )}
          {s.whatsapp && (
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <Phone size={18} />
            </a>
          )}
          {s.website && (
            <a href={s.website} target="_blank" rel="noopener noreferrer" aria-label="Sitio web">
              <Globe size={18} />
            </a>
          )}
        </div>

        <p className="text-xs text-text/40 mt-4">
          © {new Date().getFullYear()} {restaurant.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
