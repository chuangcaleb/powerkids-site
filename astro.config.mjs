import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import compressor from "astro-compressor";
import { defineConfig } from "astro/config";

import preload from "astro-preload";

// https://astro.build/config
export default defineConfig({
  site: "https://www.powerkids.edu.my",
  integrations: [
    preload(),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    // ...(import.meta.env.PROD ? [sitemap(), compress(), compressor()] : []),
  ],
  vite: {
    ssr: {
      noExternal: ["@radix-ui/*"],
    },
  },
});
