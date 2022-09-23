/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        t1: {
          bluegray: '#203C48',
          seagreen: '#22958B',
          lightgreen: '#AAD5AC',
          sand: '#EDEAC7',
          cream: '#EDF0DB',
        },
      },
    },
  },
  plugins: [],
};
