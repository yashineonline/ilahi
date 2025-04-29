//  @type {import('tailwindcss').Config}
export default {
  darkMode: 'class', // Try this more specific selector
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
  //       // You can add your custom colors here
  //       // For example:
        // primary: '#646cff',
        // secondary: '#9333ea',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#646cff",
          "primary-focus": "#4f46e5",
          "primary-content": "#ffffff",
          "secondary": "#9333ea",
          "secondary-focus": "#7e22ce",
          "secondary-content": "#ffffff",
          // Include base colors for light theme
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",
        },
        dark: {
          "primary": "#646cff",
          "primary-focus": "#4f46e5",
          "primary-content": "#ffffff",
          "secondary": "#9333ea",
          "secondary-focus": "#7e22ce",
          "secondary-content": "#ffffff",
          // Include base colors for dark theme
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "base-content": "#f9fafb",
        }
      }
    ]
      // themes: ['light', 'dark'], // Use DaisyUI's built-in light/dark themes

      // {
        // light: {
      //     // ... other color definitions
          // "secondary": "#9333ea", // This is a purple color
        // },
        // dark: {
      //     // ... other color definitions
          // "secondary": "#9333ea", // Same purple color for dark mode
        // },
      // },
    // ],
  },
}