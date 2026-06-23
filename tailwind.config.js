/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Roboto Mono"', "monospace"],
      },
      colors: {
        spotify: "#1db954",
      },
    },
  },
  plugins: [],
};
