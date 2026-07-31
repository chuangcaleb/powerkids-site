import { describe, expect, it } from 'vitest'
import { hashedFilename } from './media-filename'

const content = Buffer.from('some image bytes')
const other = Buffer.from('different image bytes')

describe('hashedFilename', () => {
  it('inserts a hash before the extension', () => {
    expect(hashedFilename('hero.webp', content)).toMatch(/^hero-[0-9a-f]{8}\.webp$/)
  })

  it('is deterministic for identical content', () => {
    expect(hashedFilename('hero.webp', content)).toBe(
      hashedFilename('hero.webp', content),
    )
  })

  it('changes when the content changes', () => {
    expect(hashedFilename('hero.webp', content)).not.toBe(
      hashedFilename('hero.webp', other),
    )
  })

  it('does not stack suffixes when a hashed name is re-uploaded', () => {
    const once = hashedFilename('hero.webp', content)
    expect(hashedFilename(once, content)).toBe(once)
  })

  it('replaces the hash when re-uploading a hashed name with new content', () => {
    const once = hashedFilename('hero.webp', content)
    const twice = hashedFilename(once, other)
    expect(twice).toMatch(/^hero-[0-9a-f]{8}\.webp$/)
    expect(twice).not.toBe(once)
  })

  it('keeps multi-dot names intact', () => {
    expect(hashedFilename('sports.day.2019.jpg', content)).toMatch(
      /^sports\.day\.2019-[0-9a-f]{8}\.jpg$/,
    )
  })

  it('handles a name with no extension', () => {
    expect(hashedFilename('brochure', content)).toMatch(/^brochure-[0-9a-f]{8}$/)
  })

  it('treats a dotfile as a stem, not an extension', () => {
    expect(hashedFilename('.gitignore', content)).toMatch(/^\.gitignore-[0-9a-f]{8}$/)
  })
})
