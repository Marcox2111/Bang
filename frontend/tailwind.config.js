/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    extend: {
      flexBasis: {
        '1/20': '5%'
      }
    },
  },
  plugins: [],
}