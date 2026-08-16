import { describe, expect, it } from 'vitest'
import { deriveLaneLayout, medianAspectRatio, photoBox } from './lane-layout'

describe('deriveLaneLayout', () => {
  it('caps lanes so each stays under the max photo height', () => {
    const { lanes, laneWidth } = deriveLaneLayout({
      containerWidth: 1200,
      gap: 24,
      aspectRatio: 16 / 9,
      minPhotoHeight: 195,
      maxPhotoHeight: 415,
      maxLanes: 6,
    })
    expect(laneWidth / (16 / 9)).toBeLessThanOrEqual(415 + 0.01)
    expect(lanes).toBeGreaterThan(0)
  })

  it('backs off lanes rather than dropping below the min photo height', () => {
    const { lanes, laneWidth } = deriveLaneLayout({
      containerWidth: 600,
      gap: 24,
      aspectRatio: 16 / 9,
      minPhotoHeight: 195,
      maxPhotoHeight: 415,
      maxLanes: 6,
    })
    expect(laneWidth / (16 / 9)).toBeGreaterThanOrEqual(195 - 0.01)
    expect(lanes).toBe(1)
  })

  it('never exceeds the lane cap even on a very wide container', () => {
    const { lanes } = deriveLaneLayout({
      containerWidth: 4000,
      gap: 24,
      aspectRatio: 16 / 9,
      minPhotoHeight: 195,
      maxPhotoHeight: 415,
      maxLanes: 6,
    })
    expect(lanes).toBeLessThanOrEqual(6)
  })

  it('always returns at least one lane', () => {
    const { lanes } = deriveLaneLayout({
      containerWidth: 50,
      gap: 24,
      aspectRatio: 16 / 9,
      minPhotoHeight: 195,
      maxPhotoHeight: 415,
      maxLanes: 6,
    })
    expect(lanes).toBe(1)
  })
})

describe('medianAspectRatio', () => {
  it('returns the middle value of a sorted list', () => {
    expect(medianAspectRatio([2, 1, 3])).toBe(2)
  })

  it('falls back to 1 for an empty list', () => {
    expect(medianAspectRatio([])).toBe(1)
  })
})

describe('photoBox', () => {
  const base = {
    aspectRatio: 16 / 9,
    laneWidth: 560,
    laneCount: 4,
    gap: 24,
    frameChromeWidth: 20,
    minPhotoHeight: 195,
    maxPhotoHeight: 415,
  }

  it('keeps span 1 and no cap when the lane already lands in-band', () => {
    const box = photoBox(base)
    expect(box.span).toBe(1)
    expect(box.maxFrameWidth).toBeNull()
  })

  it('promotes a too-short (wide landscape) photo to span 2', () => {
    // height = (560 - 20) / 3 = 180, below minPhotoHeight.
    const box = photoBox({ ...base, aspectRatio: 3 })
    expect(box.span).toBe(2)
  })

  it('never promotes past the available lane count', () => {
    const box = photoBox({ ...base, aspectRatio: 3, laneCount: 1 })
    expect(box.span).toBe(1)
  })

  it('caps the frame width for a too-tall (portrait) photo', () => {
    // height = (560 - 20) / 0.5 = 1080, above maxPhotoHeight.
    const box = photoBox({ ...base, aspectRatio: 0.5 })
    expect(box.maxFrameWidth).not.toBeNull()
    // Cap converts back through the same ratio: (maxFrameWidth - chrome) / aspectRatio ≈ maxPhotoHeight.
    const height = (box.maxFrameWidth! - base.frameChromeWidth) / 0.5
    expect(Math.abs(height - base.maxPhotoHeight)).toBeLessThanOrEqual(1)
  })
})
