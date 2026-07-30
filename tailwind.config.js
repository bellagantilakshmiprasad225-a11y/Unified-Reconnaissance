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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        soc: {
          dark: '#0a0d14',
          darker: '#06080e',
          card: '#111622',
          cardHover: '#161d2d',
          border: '#1e293b',
          accent: '#00f0ff',
          blue: '#1e40af',
          cyan: '#06b6d4',
          slate: '#334155',
          panel: '#151c2c',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 15px -3px rgba(30, 64, 175, 0.3)',
        'soc': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
