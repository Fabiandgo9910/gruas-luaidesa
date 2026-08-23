import type { Config } from "tailwindcss";

// Permite usar bg-primary/50, text-text/70, etc. con colores que vienen de
// variables CSS dinámicas (el tema de cada restaurante). Las variables CSS
// deben estar en formato "R G B" (ver globals.css y app/[slug]/layout.tsx).
function withOpacity(variableName: string) {
  return ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variableName}))`;
    }
    return `rgb(var(${variableName}) / ${opacityValue})`;
  };
}

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--color-primary"),
        secondary: withOpacity("--color-secondary"),
        bg: withOpacity("--color-bg"),
        text: withOpacity("--color-text"),
      },
      fontFamily: {
        theme: ["var(--font-theme)", "sans-serif"],
      },
      borderRadius: {
        theme: "var(--radius-theme)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        fadeIn: "fadeIn .4s ease-out both",
      },
    },
  },
  plugins: [],
};

// Tailwind acepta funciones para colores dinámicos en tiempo de ejecución,
// pero el tipo `Config` de @types no las contempla estrictamente — el cast
// aquí es seguro porque Tailwind las procesa tal cual (ver withOpacity arriba).
export default config as unknown as Config;
