/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A1A', // Preto
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
          950: '#000000',
        },
        red: {
          DEFAULT: '#E63946', // Vermelho coral
          light: '#FF6B77',
          dark: '#C1121F',
        },
        gold: {
          DEFAULT: '#D4A574', // Dourado/Âmbar
          light: '#E8C9A0',
          dark: '#B8894F',
        },
        cream: {
          DEFAULT: '#F5E6D3',
          light: '#FFF8F0',
          dark: '#E8D4BC',
        },
      },
    },
  },
  plugins: [],
}
