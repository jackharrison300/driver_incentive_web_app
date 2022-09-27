/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#ff8000',
        secondary: '#5d05f5',
        light: '#ffffff',
        dark: '#000000',
      },
    },
  },
  plugins: [],
};
