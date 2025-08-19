/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // colors: {
      //   health: "var(--color-health)",
      //   quran: "var(--color-quran)",
      //   englishLevelOne: "var(--color-english-level-one)",
      //   englishLevelTwo: "var(--color-english-level-two)",
      //   muslim: "var(--color-muslim)",
      //   arabic: "var(--color-arabic)",
      //   science: "var(--color-science)",
      //   math: "var(--color-math)",
      //   darkblue: "var(--color-darkblue)",
      //   deepnavy: "var(--color-deepnavy)",
      //   navyteal: "var(--color-navyteal)",
      //   orangedeep: "var(--color-orangedeep)",
      //   graycustom: "var(--color-graycustom)",
      // },
    },
  },
  plugins: [],
}
