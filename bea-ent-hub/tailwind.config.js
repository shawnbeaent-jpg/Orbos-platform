/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#050505',
          950: '#000000',
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
        },
        charcoal: {
          800: '#1c1c1e',
          700: '#262628',
          600: '#333335',
          500: '#48484a',
        },
        gold: {
          DEFAULT: '#D6A63C',
          50: '#FBF3E0',
          100: '#F7E7C1',
          200: '#EFD08A',
          300: '#E6BC5C',
          400: '#DDB047',
          500: '#D6A63C',
          600: '#B78A2E',
          700: '#8F6B23',
          800: '#664D19',
          900: '#3D2E0F',
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
