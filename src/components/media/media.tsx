import { Image, type ImageProps } from '@/components/image/image'
import type { Media as MediaDoc } from '@/payload-types'

export type MediaProps = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> & {
  doc: MediaDoc
  /** Overrides `doc.alt` — for decorative or contextual alt text. */
  alt?: string
}

/** Adapts a populated Payload `media` doc to the `Image` primitive. */
export function Media({ doc, alt, ...rest }: MediaProps) {
  if (!doc.url || !doc.width || !doc.height) return null

  return (
    <Image
      src={doc.url}
      alt={alt ?? doc.alt}
      width={doc.width}
      height={doc.height}
      {...rest}
    />
  )
}
