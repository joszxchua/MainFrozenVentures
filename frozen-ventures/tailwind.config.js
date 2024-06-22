/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000',
        white: '#FFFFFF',

        gray: {
          100: '#F8F8F8',
          200:'#737373',
        },

        purple: {
          100: '#BDADFF',
          200: '#7B6AC2',
        }
      }
    },
  },
  plugins: [],
}

