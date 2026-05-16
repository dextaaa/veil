import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        veil: {
          50: "#fdf2f5",
          100: "#fce7ed",
          200: "#fad0df",
          300: "#f6a9c4",
          400: "#ef749f",
          500: "#e4487a",
          600: "#d12a5e",
          700: "#b01d4b",
          800: "#931c42",
          900: "#7c1c3c",
          950: "#480a1f",
        },
      },
      backgroundImage: {
        "veil-gradient": "linear-gradient(135deg, #d12a5e 0%, #9b4fd4 100%)",
        "veil-glow": "radial-gradient(ellipse at center, rgba(209,42,94,0.15) 0%, transparent 70%)",
        "card-gradient": "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "blur-out": {
          from: { filter: "blur(20px) brightness(0.4)" },
          to: { filter: "blur(0px) brightness(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.35s ease-out",
        "blur-out": "blur-out 0.8s ease-in-out",
        shimmer: "shimmer 2s linear infinite",
        heartbeat: "heartbeat 0.6s ease-in-out",
        float: "float 3s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
      },
      boxShadow: {
        veil: "0 0 40px rgba(209, 42, 94, 0.25)",
        "veil-sm": "0 0 20px rgba(209, 42, 94, 0.15)",
        card: "0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.3)",
        "card-hover": "0 20px 40px -8px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
