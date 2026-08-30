import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Acento dorado — protagonista, se usa con intención (no en todo)
        gold: {
          light: "#F0C93A",
          DEFAULT: "#C9A227",
          dark: "#8A6E18",
        },
        // Familia de neutros cálidos oscuros — variantes de "negro marca"
        // en vez de un único negro plano repetido en toda la web.
        ink: {
          900: "#1A1208", // negro marca original — el más profundo
          800: "#26190C", // variante intermedia para dar ritmo
          700: "#2C1F0A", // "marrón marca" original
          600: "#4A371C", // marrón cálido para texto/bordes secundarios
        },
        // Familia de neutros cálidos claros — variantes del crema original
        sand: {
          100: "#FAF6EC", // crema marca original — el más claro
          200: "#F1E7CE", // arena suave, para tarjetas sobre fondo claro
          300: "#E4D2A6", // arena más profunda, para divisores/hover
        },
        // Acento secundario — reservado para urgencia/alertas puntuales
        ember: "#D4630A",
        // Verde de marca de WhatsApp, calibrado más cálido para
        // convivir con la paleta dorada en vez de chocar con ella
        whatsapp: "#3FA65A",
        // Alias de compatibilidad con el naming anterior
        brand: {
          black: "#1A1208",
          brown: "#2C1F0A",
          "brown-mid": "#3D2B0D",
          orange: "#D4630A",
          cream: "#FAF6EC",
        },
      },
      fontFamily: {
        sans: ["var(--font-barlow)", "system-ui", "sans-serif"],
        condensed: ["var(--font-barlow-condensed)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        container: "1180px",
      },
      boxShadow: {
        gold: "0 8px 30px -8px rgba(201,162,39,0.35)",
        panel: "0 30px 80px -30px rgba(0,0,0,0.6)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "ping-slow": "pingSlow 2.4s cubic-bezier(0,0,0.2,1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pingSlow: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "80%,100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
