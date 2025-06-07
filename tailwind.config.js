/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "node-bg": "#ffffff",
        "node-border": "#e2e8f0",
        "node-selected": "#3b82f6",
      },
      boxShadow: {
        node: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
