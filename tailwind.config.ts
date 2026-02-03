import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arps: {
          red: "#e11d48",
          amber: "#f59e0b",
          emerald: "#10b981",
          slate: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
