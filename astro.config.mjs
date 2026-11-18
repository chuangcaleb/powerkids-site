import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import compressor from "astro-compressor";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://powerkids.edu.my",
  // Cloudflare Pages serves a real 302 from public/_redirects; this is the
  // meta-refresh fallback for dev and other hosts.
  redirects: {
    "/whatsapp": "https://wa.me/60102212482",
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    robotsTxt(),
    ...(import.meta.env.PROD ? [sitemap(), compressor()] : []),
  ],
  vite: {
    ssr: {
      noExternal: ["@radix-ui/*"],
    },
  },
});
