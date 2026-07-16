import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: "#F7F7F4",
          surface: "#FFFFFF",
          ink: "#1C2321",
          sidebar: "#12181A",
          sidebarhover: "#1C2426",
          muted: "#70766F",
          border: "#E3E4DE",
          green: "#0F5132",
          greenlight: "#E6F0EA",
          red: "#B3261E",
          redlight: "#FBEAE9",
          gold: "#B8862B",
          goldlight: "#FAF1E1",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
