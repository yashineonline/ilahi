/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add your custom colors here
        // For example:
        primary: '#646cff',
        secondary: '#9333ea',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          // ... other color definitions
          "secondary": "#9333ea", // This is a purple color
        },
        dark: {
          // ... other color definitions
          "secondary": "#9333ea", // Same purple color for dark mode
        },
      },
    ],
  },
}