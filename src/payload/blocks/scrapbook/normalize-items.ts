import type { HeaderRichTextProps } from '@/components/rich-text/header-rich-text'
import type {
  Media as MediaDoc,
  ScrapbookBlock as ScrapbookBlockType,
} from '@/payload-types'

export type CollageItem = {
  id: string
  header: {
    heading?: HeaderRichTextProps['data'] | null
    lead?: HeaderRichTextProps['data'] | null
    accent?: 'neutral' | 'red' | 'blue' | null
  }
  button?: { label?: string | null; url?: string | null } | null
  icons: string[]
  photos: { id: string; doc: MediaDoc; aspectRatio: number }[]
}

/**
 * CMS data to plain collage props.
 *
 * Split out of the block component so it is reachable from a node test: an
 * unpopulated relationship, a media doc uploaded before dimensions were
 * recorded, and an item whose every photo was dropped are all real editor
 * states, and each one used to be an untested branch inside a server
 * component. Items with no usable photo are dropped entirely — a text cell
 * alone has nothing to collage.
 */
export function resolveCollageItems(
  items: ScrapbookBlockType['items'] | null | undefined,
): CollageItem[] {
  return (items ?? [])
    .map((item) => ({
      id: item.id ?? '',
      header: {
        heading: item.header?.heading ?? null,
        lead: item.header?.lead ?? null,
        accent: item.header?.accent ?? 'neutral',
      },
      button: item.button,
      icons: item.icons ?? [],
      photos: (item.media ?? [])
        .filter((media): media is MediaDoc => typeof media === 'object')
        .filter((doc) => doc.width && doc.height)
        .map((doc) => ({
          id: String(doc.id),
          doc,
          aspectRatio: doc.width! / doc.height!,
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
  storedSeed: ScrapbookBlockType['seed'],
  id: ScrapbookBlockType['id'],
): string {
  return storedSeed || `scrapbook-${id ?? 'preview'}`
}
