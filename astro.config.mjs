import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import compressor from "astro-compressor";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://powerkids.edu.my",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    robotsTxt(),
    ...(import.meta.env.PROD ? [sitemap(), compress(), compressor()] : []),
  ],
  vite: {
    ssr: {
      noExternal: ["@radix-ui/*"],
    },
  },
});
