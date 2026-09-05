import { describe, expect, it } from 'vitest'
import { mapCenter } from './map-center'

describe('mapCenter', () => {
  it('averages coordinates across multiple locations', () => {
    expect(
      mapCenter([
        { latitude: 3.0, longitude: 101.0 },
        { latitude: 3.2, longitude: 101.2 },
      ]),
    ).toEqual({ latitude: 3.1, longitude: 101.1, zoom: 10 })
  })

  it('zooms in closer for a single location', () => {
    expect(mapCenter([{ latitude: 3.0631, longitude: 101.6851 }])).toEqual({
      latitude: 3.0631,
      longitude: 101.6851,
      zoom: 14,
    })
  })

  it('falls back to a neutral centre for an empty list', () => {
    expect(mapCenter([])).toEqual({ latitude: 0, longitude: 0, zoom: 1 })
  })
})
