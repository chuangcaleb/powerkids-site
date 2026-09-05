import { describe, expect, it } from 'vitest'
import { directionsLink } from './directions-link'

describe('directionsLink', () => {
  it('builds a keyless Google Maps directions URL from coordinates', () => {
    expect(directionsLink(3.0631, 101.6851)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=3.0631,101.6851',
    )
  })

  it('keeps negative coordinates intact', () => {
    expect(directionsLink(-6.2, 106.8)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-6.2,106.8',
    )
  })
})
