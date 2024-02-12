/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        first: "#1F2937",
        second: "#AF2D73",
      }
    },
  },
  plugins: [],
}

