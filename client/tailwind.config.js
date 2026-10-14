/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F4ED',
        cream: '#F0E7DA',
        sand: '#E6D5C3',
        terracotta: {
          DEFAULT: '#B87560',
          dark: '#9E5F4C',
          light: '#CD8B77',
        },
        rose: {
          dusty: '#D8B4A7',
        },
        sage: {
          DEFAULT: '#A8B5A0',
          dark: '#8C9B83',
          light: '#C4CFBE',
        },
        deepBrown: '#44362F',
        secondaryText: '#786A61',
        borderMuted: '#E4D9CC',
        surfaceMuted: '#FAF6F0',
        errorDark: '#9E2A2B',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
