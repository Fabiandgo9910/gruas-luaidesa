"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DICCIONARIOS, type Idioma, type Diccionario } from "@/lib/i18n/diccionarios";

interface LanguageContextValue {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: Diccionario;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useIdioma() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useIdioma debe usarse dentro de <LanguageProvider>");
  return ctx;
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>("es");

  useEffect(() => {
    const guardado = localStorage.getItem("idioma") as Idioma | null;
    if (guardado && DICCIONARIOS[guardado]) setIdiomaState(guardado);
  }, []);

  const setIdioma = (i: Idioma) => {
    setIdiomaState(i);
    localStorage.setItem("idioma", i);
  };

  return (
    <LanguageContext.Provider value={{ idioma, setIdioma, t: DICCIONARIOS[idioma] }}>
      {children}
    </LanguageContext.Provider>
  );
}
