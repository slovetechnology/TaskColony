/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '226px',
      },

    backgroundColor: {
      'primary': '#FFF2E1',
      'secondary': '#E73D17',
      'icons': '#FBFBFB',
      'light': '#F29D8A',
      'gray': '#E2E2E2',
      'cart': '#E1E3E6',
      'yellow': '#F7C566',
      'assign': '#F29D8A',
      'pink': '#F29D8A',
    },
    colors: {
      'primary': '#6C757D',
      'secondary': '#E73D17',
      'secondary-light': '#fff3e4',
      'navy': '#1C1F34',
      'light': '#7A7A7A',
      'star': '#FFCC00',
      'success': '#258823',
      'yellow': '#F7C566',

    },
  },
},
plugins: [],
}


