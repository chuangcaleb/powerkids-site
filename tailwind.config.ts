import utopia from "tailwind-utopia";
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import { shadcnPlugin } from "./lib/shadcn-plugin";

const config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    fontFamily: {
      sans: ['"PT Sans"', "sans-serif"],
      marker: ['"Marker Felt"', "sans-serif"],
    },
    extend: {
      utopia: () => ({
        // utopia: (theme) => ({
        // minScreen: theme("screens.xs"),
        minSize: 16,
        minScale: 1.27,
        // maxScreen: theme("screens.3xl"),
        maxScreen: "1280px",
        maxSize: 19,
        maxScale: 1.37,
        // textSizes: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"],
      }),
      colors: {
        accent: {
          red: {
            DEFAULT: "hsl(var(--accent-red))",
            foreground: "hsl(var(--accent-blue-foreground))",
          },
          blue: {
            DEFAULT: "hsl(var(--accent-blue))",
            foreground: "hsl(var(--accent-blue-foreground))",
          },
        },
      },
      screens: {
        sm: "575px",
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
  // corePlugins: {
  //   preflight: false,
  // },
} satisfies Config;

export default config;
