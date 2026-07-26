const channel = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: channel("bg"),
        surface: channel("surface"),
        plate: channel("plate"),
        ink: channel("ink"),
        muted: channel("muted"),
        line: channel("line"),
        accent: {
          DEFAULT: channel("accent"),
          ink: channel("accent-ink"),
        },
        positive: channel("positive"),
        notice: channel("notice"),
        danger: channel("danger"),
      },
      fontFamily: {
        sans: [
          "'Inter Variable'",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "sans-serif",
        ],
        display: ["'Instrument Serif'", "Georgia", "'Times New Roman'", "serif"],
      },
      borderRadius: {
        none: "0",
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
        lg: "2px",
        full: "9999px",
      },
      boxShadow: {
        none: "none",
        portal: "var(--elevation-portal)",
      },
      spacing: {
        sidebar: "var(--sidebar-w)",
        topbar: "var(--topbar-h)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.2, 0, 0, 1)",
      },
      transitionDuration: {
        DEFAULT: "160ms",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-in": "fade-in 160ms cubic-bezier(0.2, 0, 0, 1)",
        "slide-from-left": "slide-from-left 220ms cubic-bezier(0.2, 0, 0, 1)",
        "rise-in": "rise-in 220ms cubic-bezier(0.2, 0, 0, 1)",
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};
