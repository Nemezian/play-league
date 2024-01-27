/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      BlackopsOne: ["Black Ops One", "system-ui"],
    },
    extend: {
      colors: {
        primary: "#0F0F0F",
        secondary: "#232D3F",
        third: "#005B41",
        fourth: "#008170",
      },
      boxShadow: {
        s: "0px 4px 0px 0px #005b41;",
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      // screens: {
      //   xs: "480px",
      //   ss: "620px",
      //   sm: "768px",
      //   md: "1024px",
      //   lg: "1200px",
      //   xl: "1700px",
      // },
    },
  },
  plugins: [require("flowbite/plugin")],
}
