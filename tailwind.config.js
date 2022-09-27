/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ff8000',
        secondary: '#5d05f5',
        lightgray: '#e8e8e8',
        darkgray: '#1f1f1f',
        light: '#ffffff',
        dark: '#000000',
      },
    },
  },
  plugins: [],
};
