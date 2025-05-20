/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      container: {
        padding: "2rem",
        center: true,
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
      fontFamily: {
        roboto: ["Roboto, sans-serif"],
        nunito: ["Nunito Sans, sans-serif"],
      },
      colors: {
        primary: "#3D56B2",
        sidenav: {
          DEFAULT: "#f8f8f7",
          dark: "#202020",
        },

        text: {
          DEFAULT: "#2E335B",
          dark: "#D4D4D4",
        },

        hover: {
          DEFAULT: "#2C2C2C",
          dark: "#2C2C2C"
        },

        error: "#D84A49",
        warning: "#eab308",
        info: "#6CB3C7",
        success: "#5BC3A2",
      },
      backgroundImage: {
        shimmer: 'linear-gradient(90deg, #e2e2e2 25%, #f4f4f4 50%, #e2e2e2 75%)',
        'shimmer-dark': 'linear-gradient(90deg, #303030 25%, #3c3c3c 50%, #303030 75%)',
      },
      animation: {
        shimmer: 'shimmer 3s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
