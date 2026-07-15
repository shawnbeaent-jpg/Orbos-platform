/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: 'rgb(var(--color-white) / <alpha-value>)',
        midnight: {
          DEFAULT: 'rgb(var(--color-midnight-950) / <alpha-value>)',
          950: 'rgb(var(--color-midnight-950) / <alpha-value>)',
          900: 'rgb(var(--color-midnight-900) / <alpha-value>)',
          800: 'rgb(var(--color-midnight-800) / <alpha-value>)',
          700: 'rgb(var(--color-midnight-700) / <alpha-value>)',
        },
        charcoal: {
          800: 'rgb(var(--color-charcoal-800) / <alpha-value>)',
          700: 'rgb(var(--color-charcoal-700) / <alpha-value>)',
          600: 'rgb(var(--color-charcoal-600) / <alpha-value>)',
          500: 'rgb(var(--color-charcoal-500) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--color-gold-500) / <alpha-value>)',
          50: 'rgb(var(--color-gold-50) / <alpha-value>)',
          100: 'rgb(var(--color-gold-100) / <alpha-value>)',
          200: 'rgb(var(--color-gold-200) / <alpha-value>)',
          300: 'rgb(var(--color-gold-300) / <alpha-value>)',
          400: 'rgb(var(--color-gold-400) / <alpha-value>)',
          500: 'rgb(var(--color-gold-500) / <alpha-value>)',
          600: 'rgb(var(--color-gold-600) / <alpha-value>)',
          700: 'rgb(var(--color-gold-700) / <alpha-value>)',
          800: 'rgb(var(--color-gold-800) / <alpha-value>)',
          900: 'rgb(var(--color-gold-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        gold: '0 0 24px 0 rgba(214, 166, 60, 0.35)',
        'gold-lg': '0 0 48px 0 rgba(214, 166, 60, 0.28)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(214,166,60,0.5)' },
          '50%': { opacity: '0.85', boxShadow: '0 0 0 6px rgba(214,166,60,0)' },
        },
        'glow-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(214,166,60,0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(214,166,60,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(214,166,60,0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        'pulse-gold': 'pulse-gold 2.4s ease-in-out infinite',
        'glow-ring': 'glow-ring 1.2s ease-out',
      },
      backgroundImage: {
        'gold-shimmer':
          'linear-gradient(110deg, transparent 40%, rgba(214,166,60,0.35) 50%, transparent 60%)',
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(214,166,60,0.14), transparent 60%)',
      },
    },
  },
  plugins: [],
};
