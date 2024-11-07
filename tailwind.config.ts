import type { Config } from "tailwindcss";
import fs from "fs";
import path from "path";

const theme = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/constants/theme.json"), "utf-8")
);

const generateColorUtilities = (themeColors: {
  [key: string]: { [key: string]: string };
}) => {
  const colorUtilities: { [key: string]: { [key: string]: string } } = {};
  Object.entries(themeColors).forEach(([colorName, colorShades]) => {
    colorUtilities[colorName] = colorShades;
  });
  return colorUtilities;
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: generateColorUtilities(theme.colors),
      maxWidth: {
        "screen-1.5xl": "1440px",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        noto: ["Noto Serif", "serif"],
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
export default config;
