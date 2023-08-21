import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import compressor from "astro-compressor";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.powerkids.edu.my",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    ...(import.meta.env.PROD ? [sitemap(),  compressor()] : []),
  ],
  vite: {
    ssr: {
      noExternal: ["@radix-ui/*"],
    },
  },
});
