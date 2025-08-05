/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9fa',
          100: '#d9f2f5',
          500: '#128297',
          600: '#0f6b7d',
          700: '#0d5a68',
        }
      }
    },
  },
  plugins: [],
} 