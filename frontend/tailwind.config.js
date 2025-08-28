/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fad5a5',
          300: '#f7b86d',
          400: '#f39533',
          500: '#f0790b',
          600: '#e15e06',
          700: '#ba4609',
          800: '#94380f',
          900: '#783010',
          950: '#431506',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        cozy: {
          cream: '#faf7f0',
          sand: '#f4ede4',
          warm: '#e8dcc6',
          brown: '#a67c52',
          sage: '#9caf88',
          moss: '#4a5d39',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};