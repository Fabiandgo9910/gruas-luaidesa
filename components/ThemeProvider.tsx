"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Tema = "dark" | "light";

interface ThemeContextValue {
  tema: Tema;
  toggleTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}

/**
 * El modo por defecto es "dark" (la identidad visual original de la
 * marca). El script inline en <head> (ver layout.tsx) ya aplica la
 * clase correcta ANTES de que React hidrate, para que no haya parpadeo
 * visual al cargar la página.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("dark");

  useEffect(() => {
    const guardado = localStorage.getItem("tema") as Tema | null;
    if (guardado === "light" || guardado === "dark") setTema(guardado);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", tema === "light");
    document.documentElement.classList.toggle("dark", tema === "dark");
    localStorage.setItem("tema", tema);
  }, [tema]);

  const toggleTema = () => setTema((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ tema, toggleTema }}>{children}</ThemeContext.Provider>;
}
