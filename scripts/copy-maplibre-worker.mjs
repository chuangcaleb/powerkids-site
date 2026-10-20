#!/usr/bin/env node
/**
 * Copy MapLibre's tile-parsing worker into public/.
 *
 * MapLibre v6 is ESM-only and resolves its worker via a URL derived from
 * `import.meta.url`. Neither Turbopack nor Webpack (`next build`) emits the
 * worker as a servable asset — without this copy the map mounts and never
 * requests a tile, with no exception and no console error. Since 6.13 the
 * worker is self-contained (no `maplibre-gl-shared.mjs` sibling import), so
 * only the worker file is copied.
 *
 * Wired to predev/prebuild/build:compile/vercel-build — pnpm/npm skip
 * lifecycle scripts when they decide there's "no work to do," so
 * `postinstall` alone is documented as insufficient here.
 */
import { createRequire } from 'node:module'
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)

const maplibreDir = path.dirname(require.resolve('maplibre-gl/package.json'))
const distDir = path.join(maplibreDir, 'dist')
const outDir = path.join(process.cwd(), 'public/maplibre')

const FILE = 'maplibre-gl-worker.mjs'

await mkdir(outDir, { recursive: true })
await copyFile(path.join(distDir, FILE), path.join(outDir, FILE))
console.log(`copied ${FILE} -> public/maplibre/`)
