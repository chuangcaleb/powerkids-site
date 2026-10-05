#!/usr/bin/env node
/**
 * Copy MapLibre's tile-parsing worker into public/.
 *
 * MapLibre v6 is ESM-only and resolves its worker via a URL derived from
 * `import.meta.url`. Neither Turbopack nor Webpack (`next build`) emits the
 * worker's `maplibre-gl-shared.mjs` sibling alongside it — the map mounts and
 * never requests a tile, with no exception and no console error. Both files
 * are copied into the same directory because the worker imports its sibling
 * by relative path.
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

const FILES = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']

await mkdir(outDir, { recursive: true })

for (const file of FILES) {
  await copyFile(path.join(distDir, file), path.join(outDir, file))
  console.log(`copied ${file} -> public/maplibre/`)
}
