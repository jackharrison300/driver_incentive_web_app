/** @type {import('tailwindcss').Config} */

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
        t2: {
          red: '#ee281b',
          green: '#277b00',
          darkgreen: '#172619',
          lightgreen: '#e8ffdd',
          darkred: '#610011',
          brown: '#240000',
        },
      },
    },
  },
  plugins: [],
};
