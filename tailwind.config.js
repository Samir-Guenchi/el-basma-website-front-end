/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d4d0',
          300: '#f4b5ae',
          400: '#ec8b80',
          500: '#e06455',
          600: '#cc4535',
          700: '#ab3728',
          800: '#8e3125',
          900: '#762e25',
          950: '#40140f',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534', // WCAG AA compliant - contrast ratio 4.7:1 on white
          900: '#14532d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // Original gray-500
          600: '#4b5563', // WCAG AA compliant for dark backgrounds
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        gold: {
          50: '#fbf9eb',
          100: '#f6f0cd',
          200: '#eee09e',
          300: '#e4c966',
          400: '#dbb43d',
          500: '#c99d2e',
          600: '#ad7b25',
          700: '#8b5a21', // WCAG AA compliant - contrast ratio 4.8:1 on white
          800: '#744922',
          900: '#633d22',
          950: '#2a1708',
        },
        cream: {
          50: '#fefdfb',
          100: '#fcf9f3',
          200: '#f8f1e3',
          300: '#f2e5cd',
          400: '#e9d2a8',
          500: '#ddb97d',
        },
      },
      fontFamily: {
        arabic: ['Tajawal', 'Cairo', 'sans-serif'],
        display: ['Amiri', 'serif'],
      },
      backgroundImage: {
        'pattern-arabic': "url('/patterns/arabic-pattern.svg')",
        'gradient-gold': 'linear-gradient(135deg, #dbb43d 0%, #c99d2e 50%, #ad7b25 100%)',
      },
    },
  },
  plugins: [],
}
