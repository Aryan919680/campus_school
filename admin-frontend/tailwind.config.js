import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))",
      },
    },
  },
  plugins: [forms],
};
