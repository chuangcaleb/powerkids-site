import { describe, expect, it } from 'vitest'
import { slugify } from './slug'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Morning School')).toBe('morning-school')
  })

  it('collapses runs of separators', () => {
    expect(slugify('After  School --- Program')).toBe('after-school-program')
  })

  it('trims leading and trailing separators', () => {
    expect(slugify('  Who We Are!  ')).toBe('who-we-are')
  })

  it('strips accents rather than dropping the letter', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume')
  })

  it('drops characters with no ASCII equivalent', () => {
    expect(slugify('学校 Sri Petaling')).toBe('sri-petaling')
  })

  it('returns an empty string when nothing survives', () => {
    expect(slugify('!!!')).toBe('')
  })
})
