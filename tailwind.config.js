/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#FAF0E6", dark: "#F0E4D2" },
        cream: "#FFFCF6",
        ink: { DEFAULT: "#3B2F28", soft: "#6B5A4E" },
        terracotta: { DEFAULT: "#BE5D4E", dark: "#9E4739" },
        barn: { DEFAULT: "#4E5B45", light: "#6F7D5A" },
        wheat: { DEFAULT: "#C79A54", light: "#E0C489" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { tightish: "-0.02em" },
      boxShadow: {
        soft: "0 16px 44px -20px rgba(59, 47, 40, 0.30)",
        lift: "0 28px 60px -28px rgba(59, 47, 40, 0.40)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: { marquee: "marquee 34s linear infinite" },
    },
  },
  plugins: [],
};
