import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
    colors: {
      ink: { DEFAULT: '#12161C', soft: '#1B212B', line: '#2B3340' },
      paper: '#F4F5F1',
      card: '#FFFFFF',
      line: '#E3E4DD',
      indigo: { DEFAULT: '#33438D', deep: '#232E63', soft: '#EAECF7' },
      positive: { DEFAULT: '#1E7F4E', soft: '#E7F3EC' },
      negative: { DEFAULT: '#B23A2E', soft: '#FBEAE7' },
      amber: { DEFAULT: '#B8860B', soft: '#FBF3DF' },
      muted: '#6B6F76'
    },
    fontFamily: {
      display: ['"Space Grotesk"', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'monospace']
    },
    boxShadow: {
      card: '0 1px 2px rgba(18,22,28,0.04), 0 1px 8px rgba(18,22,28,0.04)',
      panel: '0 4px 24px rgba(18,22,28,0.06)'
    }
  }
},
  plugins: [],
};

export default config;
