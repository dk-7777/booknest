/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        electric: {
          blue: '#2563eb',
          cyan: '#00f2fe',
          teal: '#14b8a6',
          indigo: '#4f46e5',
        },
        obsidian: {
          950: '#05070d',
          900: '#090d18',
          850: '#0e1424',
          800: '#141c30',
          750: '#1a243d',
          700: '#23304e',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'book': '0 10px 30px rgba(0, 0, 0, 0.6)',
        'book-hover': '0 20px 45px rgba(14, 165, 233, 0.25)',
        'glow-blue': '0 0 25px rgba(56, 189, 248, 0.35)',
        'glow-cyan': '0 0 30px rgba(0, 242, 254, 0.4)',
        'glow-electric': '0 0 40px rgba(37, 99, 235, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
