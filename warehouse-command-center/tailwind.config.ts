import type { Config } from 'tailwindcss';

/**
 * Construction-operations design system. Neutral steel/graphite base with
 * high-contrast status accents. Deliberately not an e-commerce look.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f5f7fa',
          100: '#e6ebf1',
          200: '#c9d4e0',
          300: '#a3b4c7',
          400: '#7288a3',
          500: '#4f6785',
          600: '#3c506b',
          700: '#2f3f55',
          800: '#212d3d',
          900: '#151d28',
        },
        // Operational status accents used across badges and cards.
        status: {
          ready: '#15803d',
          blocked: '#b91c1c',
          delayed: '#b45309',
          damaged: '#be123c',
          partial: '#a16207',
          transit: '#1d4ed8',
          awaiting: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
