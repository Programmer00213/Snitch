/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns:{
        '13': 'repeat(13, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}

