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
          100: '#ECECEC',
          200:'#737373',
        },

        purple: {
          100: '#BDADFF',
          200: '#7B6AC2',
        },

        red: {
          100: '#FF9797',
          200: '#B00D0D'
        },

        green: {
          100: '#ADFF97',
          200: '#239205'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

