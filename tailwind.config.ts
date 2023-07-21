import utopia from "tailwind-utopia";
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import { shadcnPlugin } from "./lib/shadcn-plugin";

const config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    extend: {
      utopia: () => ({
        // utopia: (theme) => ({
        // minScreen: theme("screens.xs"),
        minSize: 12,
        minScale: 1.3,
        // maxScreen: theme("screens.3xl"),
        maxSize: 16,
        maxScale: 1.4,
        // textSizes: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"],
      }),
      colors: {
        pk: {
          red: "var(--red)",
          blue: "var(--blue)",
        },
      },
      screens: {
        sm: "425px",
      },
    },
  },

  plugins: [
    shadcnPlugin,
    animatePlugin,
    utopia({
      useClamp: false,
      // prefix: "",
      // baseTextSize: "base",
    }),
  ],
} satisfies Config;

export default config;
