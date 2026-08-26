import { describe, expect, it } from 'vitest'
import type { Media, ScrapbookBlock } from '@/payload-types'
import { resolveCollageItems, resolveSeed } from './normalize-items'

type Items = NonNullable<ScrapbookBlock['items']>

function mediaAsset(overrides: Partial<Media> = {}): Media {
  return {
    id: 1,
    alt: 'A photo',
    url: '/photo.jpg',
    width: 1200,
    height: 800,
    updatedAt: '',
    createdAt: '',
    ...overrides,
  } as Media
}

function item(overrides: Partial<Items[number]> = {}): Items[number] {
  return {
    id: 'item-1',
    media: [mediaAsset()],
    ...overrides,
  } as Items[number]
}

describe('resolveCollageItems', () => {
  it('derives an aspect ratio from the media asset', () => {
    const [resolved] = resolveCollageItems([item()])
    expect(resolved!.photos[0]!.aspectRatio).toBe(1.5)
  })

  it('drops an unpopulated relationship', () => {
    const resolved = resolveCollageItems([item({ media: [7] as Items[number]['media'] })])
    expect(resolved).toEqual([])
  })

  it('drops a media asset with no recorded dimensions', () => {
    const resolved = resolveCollageItems([
      item({ media: [mediaAsset({ width: null, height: null })] }),
    ])
    expect(resolved).toEqual([])
  })

  it('drops an item once every photo of it is unusable, keeping the rest', () => {
    const resolved = resolveCollageItems([
      item({ id: 'empty', media: [] }),
      item({ id: 'kept' }),
    ])
    expect(resolved.map((entry) => entry.id)).toEqual(['kept'])
  })

  it('treats a missing items array as empty', () => {
    expect(resolveCollageItems(null)).toEqual([])
    expect(resolveCollageItems(undefined)).toEqual([])
  })
})

describe('resolveSeed', () => {
  it('prefers the stored seed', () => {
    expect(resolveSeed('shuffled-3', 'block-4')).toBe('shuffled-3')
  })

  it('falls back to the block id, so an unshuffled block is still stable', () => {
    expect(resolveSeed(null, 'block-4')).toBe('scrapbook-block-4')
    expect(resolveSeed('', 'block-4')).toBe('scrapbook-block-4')
  })

  it('falls back to a fixed string in the admin preview, where there is no id', () => {
    expect(resolveSeed(null, null)).toBe('scrapbook-preview')
  })
})
