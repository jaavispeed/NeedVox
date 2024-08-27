/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily:{
        rubik: ['Rubik', 'sans-serif'],
      },
      fontWeight: {
        light: 300,
      }
    },
  },
  plugins: [],
}
