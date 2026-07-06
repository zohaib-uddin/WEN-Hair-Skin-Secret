import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F4D3A", // Dark Green
          light: "#2a694f",
          dark: "#143326",
        },
        secondary: {
          DEFAULT: "#F7F2EA", // Cream Beige
          light: "#faf8f5",
          dark: "#ebe2d3",
        },
        accent: {
          DEFAULT: "#C9A227", // Gold
          light: "#dbb53d",
          dark: "#a3811c",
        },
        surface: {
          DEFAULT: "#FAFAF9", // Very light warm gray for cards
          dark: "#f0efec",
        },
        text: {
          main: "#1C1917", // Soft Black
          muted: "#78716C", // Warm Gray
        },
      },
      fontFamily: {
        playfair: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "sans-serif"],
      },
      lineHeight: {
        relaxed: "1.6",
      },
    },
  },
  plugins: [],
};

export default config;
