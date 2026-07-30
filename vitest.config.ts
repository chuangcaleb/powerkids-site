import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    // Unit tests only. Anything needing a browser belongs in the end-to-end
    // suite, which arrives with the first real pages.
    include: ['src/**/*.test.ts'],
  },
})
