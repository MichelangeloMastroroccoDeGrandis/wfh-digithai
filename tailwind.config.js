/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#1d1d1d',
        header: '#fefffe',
        background: '#f2f2f2',
        component: '#f9f9f9',
        primary: '#474747',
        secondary: '#b1b2b1',
      },
    },
  },
  plugins: [],
};
