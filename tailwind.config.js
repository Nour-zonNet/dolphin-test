/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: "#0077B6",
        quran: "#2E7D32",
        englishLevelOne: "#BCA7F5",
        englishLevelTwo: "#5A2D82",
        muslim: "#746751",
        arabic: "#7E424A",
        science: "#D47C7C",
        math: "#D4C71C",
        darkblue: "#0C2D40",
        deepnavy: "#061A2F",
        navyteal: "#08233F",
        orangedeep: "#E89B32",
        graycustom: "#8C8C8C",
      },
    },
  },
  plugins: [],
}
