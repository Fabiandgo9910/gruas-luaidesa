"use client";
import { useTheme } from "@/components/ThemeProvider";

/** Icono de sol/luna, sin dependencias externas. */
function IconSunMoon({ isDark }: { isDark: boolean }) {
  if (isDark) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { tema, toggleTema } = useTheme();
  const isDark = tema === "dark";

  return (
    <button
      onClick={toggleTema}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className={`btn-tap w-9 h-9 rounded-full border border-gold/25 flex items-center justify-center text-gold hover:border-gold transition-colors ${className}`}
    >
      <IconSunMoon isDark={isDark} />
    </button>
  );
}
