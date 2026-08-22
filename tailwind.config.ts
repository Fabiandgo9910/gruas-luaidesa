import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca original — sin cambios de valor, solo se mantiene.
        gold: {
          light: "#F0C93A",
          DEFAULT: "#C9A227",
          dark: "#8A6E18",
        },
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
