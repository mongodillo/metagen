module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html", "./src/*.{js, jsx, ts, tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "10rem",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-radial-to-tr": "radial-gradient(115% 90% at 0% 100%, var(--tw-gradient-stops))",
        "gradient-radial-to-tl": "radial-gradient(115% 90% at 100% 100%, var(--tw-gradient-stops))",
        "gradient-radial-to-br": "radial-gradient(90% 115% at 0% 0%, var(--tw-gradient-stops))",
        "gradient-radial-to-bl": "radial-gradient(90% 115% at 100% 0%, var(--tw-gradient-stops))",
      },
      zIndex: {
        999: "999",
      },
      colors: {
        sitecol: {
          0: "#F6F6F6",
          1: "#C2EDCE",
          2: "#BADFE7",
          3: "#6FB3B8",
          4: "#388087",
        },
        textcol: "#6b7280",
      },

      keyframes: {
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "toast-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "toast-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        fadein: "fadein 0.5s ease-in-out",
        spinslow: "spin 1.5s linear infinite",
        "toast-in-left": "toast-in-left 0.7s",
        "toast-in-right": "toast-in-right 0.7s",
      },
    },
  },
  daisyui: {
    themes: [
      {
        main: {
          ...require("daisyui/src/colors/themes")["[data-theme=business]"],
          primary: "#388087",
          "primary-content": "#f3f4f6",
          secondary: "#6fb3b8",
          accent: "#c2edce",
          neutral: "#6b7280",
          "neutral-content": "#f3f4f6",
          "base-100": "#f3f4f6",
          info: "#e5e7eb",
          success: "#c2edce",
          warning: "#fde68a",
          error: "#fecdd3",
        },

        maindark: {
          ...require("daisyui/src/colors/themes")["[data-theme=business]"],
          accent: "#0092D6",
        },
      },

      "business",
    ],
  },
  plugins: [require("daisyui")],
};
