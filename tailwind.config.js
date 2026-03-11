/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1e3a5f",
          dark: "#0f2440",
          light: "#2a4f7c",
        },
        golden: {
          DEFAULT: "#c9a84c",
          light: "#f0d080",
        },
      },
    },
  },
  plugins: [],
}