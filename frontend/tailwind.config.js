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
          DEFAULT: '#AB3933', // rgb(171, 57, 51)
          light: '#C85A54',
          dark: '#8A2E29',
        },
        gold: {
          DEFAULT: '#E3C276', // rgb(227, 194, 118)
          light: '#EDD49A',
          dark: '#C9A85C',
        },
        cream: {
          DEFAULT: '#DBE4C1', // rgb(219, 228, 193)
          light: '#E8EED8',
          dark: '#B8C9A0',
        },
      },
    },
  },
  plugins: [],
}
