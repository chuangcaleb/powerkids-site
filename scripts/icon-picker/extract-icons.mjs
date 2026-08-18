// Throwaway: dumps every lucide-react icon as { exportName, kebab, node } into icons.json
// so the picker prototype can render real SVGs offline. Not part of the app.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

// Resolve through the installed package so the dump always matches the version
// the app actually builds against.
const require = createRequire(import.meta.url)
const ICON_DIR = path.join(
  path.dirname(require.resolve('lucide-react/package.json')),
  'dist/esm/icons',
)

const files = (await readdir(ICON_DIR)).filter((f) => f.endsWith('.mjs'))

const icons = []
for (const file of files) {
  const kebab = file.replace(/\.mjs$/, '')
  const src = await readFile(path.join(ICON_DIR, file), 'utf8')
  const match = src.match(/const (\w+) = createLucideIcon\(/)
  if (!match) continue
  const { __iconNode } = await import(path.join(ICON_DIR, file))
  icons.push({ name: match[1], kebab, node: __iconNode })
}

icons.sort((a, b) => a.name.localeCompare(b.name))
await writeFile(
  path.join(import.meta.dirname, 'icons.json'),
  JSON.stringify(icons),
  'utf8',
)
console.log(`wrote ${icons.length} icons`)
