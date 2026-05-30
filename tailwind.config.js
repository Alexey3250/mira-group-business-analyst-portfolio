/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a",
        sub: "#6b6862",
        faint: "#9a978f",
        panel: "#f5f4f0",
        panel2: "#efede7",
        line: "#e7e4dd",
        pos: { DEFAULT: "#3b6d11", bg: "#eaf3de" },
        neg: { DEFAULT: "#993c1d", bg: "#faece7" },
        warn: { DEFAULT: "#854f0b", bg: "#faeeda" },
        info: { DEFAULT: "#0c447c", bg: "#e6f1fb" },
        c: {
          green: "#1d9e75",
          blue: "#378add",
          violet: "#7f77dd",
          amber: "#ef9f27",
          rose: "#d4537e",
          slate: "#888780",
          teal: "#5dcaa5",
        },
      },
      borderRadius: {
        md: "6px",
        lg: "10px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", "1.3"],
      },
      letterSpacing: {
        wider2: "0.14em",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
