import type { HeaderRichTextProps } from '@/components/rich-text/header-rich-text'
import type { Media, ScrapbookBlock } from '@/payload-types'

export type CollageItem = {
  id: string
  header: {
    heading?: HeaderRichTextProps['data'] | null
    lead?: HeaderRichTextProps['data'] | null
  }
  button?: { label?: string | null; url?: string | null } | null
  icons: string[]
  photos: { id: string; asset: Media; aspectRatio: number }[]
}

/**
 * CMS data to plain collage props.
 *
 * Split out of the block component so it is reachable from a node test: an
 * unpopulated relationship, a media asset uploaded before dimensions were
 * recorded, and an item whose every photo was dropped are all real editor
 * states, and each one used to be an untested branch inside a server
 * component. Items with no usable photo are dropped entirely — a text cell
 * alone has nothing to collage.
 */
export function resolveCollageItems(
  items: ScrapbookBlock['items'] | null | undefined,
): CollageItem[] {
  return (items ?? [])
    .map((item) => ({
      id: item.id ?? '',
      header: {
        heading: item.header?.heading ?? null,
        lead: item.header?.lead ?? null,
      },
      button: item.button,
      icons: item.icons ?? [],
      photos: (item.media ?? [])
        .filter((media): media is Media => typeof media === 'object')
        .filter((asset) => asset.width && asset.height)
        .map((asset) => ({
          id: String(asset.id),
          asset,
          aspectRatio: asset.width! / asset.height!,
        })),
    }))
    .filter((item) => item.photos.length > 0)
}

/**
 * Editor-controlled via the "Shuffle layout" button (see seed-field.tsx),
 * stored on the block rather than left implicit — otherwise the only way to
 * change the arrangement would be to edit content and re-trigger a build, and
 * the id-derived fallback would silently reshuffle any time the block's id
 * itself changes (e.g. duplicating the block).
 */
export function resolveSeed(
  storedSeed: ScrapbookBlock['seed'],
  id: ScrapbookBlock['id'],
): string {
  return storedSeed || `scrapbook-${id ?? 'preview'}`
}
