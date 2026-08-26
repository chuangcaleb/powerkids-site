import { Image, type ImageProps } from '@/components/image/image'
import type { Media } from '@/payload-types'

export type MediaProps = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> & {
  asset: Media
  /** Overrides `asset.alt` — for decorative or contextual alt text. */
  alt?: string
}

/** Adapts a populated Payload `media` asset to the `Image` primitive. */
export function Media({ asset, alt, ...rest }: MediaProps) {
  if (!asset.url || !asset.width || !asset.height) return null

  return (
    <Image
      src={asset.url}
      alt={alt ?? asset.alt}
      width={asset.width}
      height={asset.height}
      {...rest}
    />
  )
}
