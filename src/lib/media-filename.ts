import { createHash } from 'node:crypto'

/**
 * Append a short content hash to an uploaded filename.
 *
 * Media is served from a CDN-backed domain with a long cache lifetime, so a
 * file that keeps its name keeps its cached copy. An editor replacing a photo
 * would see no change for hours and reasonably conclude the CMS is broken.
 *
 * Hashing the *content* rather than using a random suffix means:
 *   - different content always gets a different URL, so replacements appear
 *     immediately and the cache can be treated as immutable;
 *   - identical content re-uploaded produces the same name, so re-running a
 *     seed script does not litter the bucket with duplicates.
 *
 * Eight hex characters is 32 bits. For a site with thousands of images, not
 * billions, collision risk is negligible — and a collision between two files
 * with identical content is not a collision at all.
 */
export function hashedFilename(filename: string, content: Buffer): string {
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 8)
  const { stem, extension } = splitFilename(filename)

  // Re-uploading an already-hashed file (a seed re-run, a copied asset) must
  // not stack suffixes: hero-a1b2c3d4-a1b2c3d4.webp helps nobody.
  const base = stem.replace(/-[0-9a-f]{8}$/, '')

  return `${base}-${hash}${extension}`
}

function splitFilename(filename: string): { stem: string; extension: string } {
  const dot = filename.lastIndexOf('.')

  // No dot, or a leading dot with no extension (".gitignore"): treat the whole
  // thing as the stem rather than inventing an extension.
  if (dot <= 0) return { stem: filename, extension: '' }

  return { stem: filename.slice(0, dot), extension: filename.slice(dot) }
}
