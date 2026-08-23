import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(value: number, currency = "€") {
  return `${currency}${Number(value).toFixed(2)}`;
}

// Lista de alérgenos comunes (UE) reutilizable en formularios
export const COMMON_ALLERGENS = [
  "Gluten",
  "Crustáceos",
  "Huevos",
  "Pescado",
  "Cacahuetes",
  "Soja",
  "Lácteos",
  "Frutos de cáscara",
  "Apio",
  "Mostaza",
  "Sésamo",
  "Sulfitos",
  "Moluscos",
  "Altramuces",
];

// Convierte un color hex (#111111 o #fff) a "R G B" para usarlo como variable
// CSS compatible con los modificadores de opacidad de Tailwind (bg-primary/50, etc.)
export function hexToRgbChannels(hex: string): string {
  if (!hex) return "17 17 17";
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return "17 17 17";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

export function slugifyBasic(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
