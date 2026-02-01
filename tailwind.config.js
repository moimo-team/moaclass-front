/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nanum-light': ['NanumSquareLight', 'sans-serif'],
        'nanum': ['NanumSquare', 'sans-serif'],
        'nanum-bold': ['NanumSquareBold', 'sans-serif'],
        'nanum-extrabold': ['NanumSquareExtraBold', 'sans-serif'],
        'nanum-acb': ['NanumSquareAcb', 'sans-serif'],
        'nanum-aceb': ['NanumSquareAceb', 'sans-serif'],
        'nanum-acl': ['NanumSquareAcl', 'sans-serif'],
        'nanum-acr': ['NanumSquareAcr', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
