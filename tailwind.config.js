/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#FAF0E6", dark: "#F0E4D2" },
        cream: "#FFFCF6",
        ink: { DEFAULT: "#3B2F28", soft: "#6B5A4E" },
        // DEFAULT darkened from #BE5D4E on 9 Aug 2026. It measured 4.21 against the
        // cream ground and 4.21 with cream on top of it, so it failed AA in BOTH
        // directions: as link text everywhere on the site, and as the fill of every
        // .btn-primary. #AD5142 measures 5.09 both ways. One token, both faults, and
        // it sits between their old DEFAULT and their own dark tone so it stays in
        // the family. dark is untouched at 6.01.
        terracotta: { DEFAULT: "#AD5142", dark: "#9E4739" },
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
      // The marquee keyframes used to live here and it did not work: Tailwind only
      // emits a @keyframes block when its matching utility (animate-marquee) appears
      // in the scanned markup, and nothing used the utility — a plain rule in
      // globals.css named the animation directly. So the keyframes were purged and
      // the strip never moved. They now live in globals.css beside the rule that
      // uses them. Do not move them back here without also using the utility.
    },
  },
  plugins: [],
};
