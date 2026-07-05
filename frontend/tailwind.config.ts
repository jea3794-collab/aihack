import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#22c55e",
          orange: "#f97316",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #22c55e 0%, #f97316 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
