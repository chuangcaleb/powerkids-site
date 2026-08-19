import { describe, expect, it } from 'vitest'
import { createSeededRandom } from './seeded-random'

describe('createSeededRandom', () => {
  it('produces the same sequence for the same seed', () => {
    const a = createSeededRandom('hero')
    const b = createSeededRandom('hero')
    const sequenceA = [a(), a(), a()]
    const sequenceB = [b(), b(), b()]
    expect(sequenceA).toEqual(sequenceB)
  })

  it('produces a different sequence for a different seed', () => {
    const a = createSeededRandom('hero')
    const b = createSeededRandom('programs')
    expect(a()).not.toBe(b())
  })

  it('stays within [0, 1)', () => {
    const random = createSeededRandom('bounds-check')
    for (let i = 0; i < 100; i++) {
      const value = random()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})
