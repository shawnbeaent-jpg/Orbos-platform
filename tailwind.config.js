/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GA Land Clearing brand palette (contrast-refined for WCAG 2.2 AA)
        midnight: "#0B1420",
        charcoal: "#17212B",
        forest: "#174C3C",
        emerald: "#22A06B",
        gold: "#D8A94A",
        sand: "#F4F0E8",
        brandslate: "#52606D",
        success: "#16A66A",
        warning: "#F0A229",
        error: "#D64A4A",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(11,20,32,0.08), 0 8px 24px rgba(11,20,32,0.06)",
        "card-lg": "0 4px 12px rgba(11,20,32,0.12), 0 24px 48px rgba(11,20,32,0.10)",
        cta: "0 8px 24px rgba(34,160,107,0.35)",
      },
      backgroundImage: {
        "hero-grade": "linear-gradient(135deg, #0B1420 0%, #17212B 55%, #174C3C 135%)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
