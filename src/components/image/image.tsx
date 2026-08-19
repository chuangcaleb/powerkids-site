import NextImage from 'next/image'
import { cx } from '@/lib/cx'
import styles from './image.module.css'

export type ImageProps = {
  src: string
  alt: string
  width: number
  height: number
  /** Responsive size hint passed to `next/image`. Defaults to full-bleed. */
  sizes?: string
  priority?: boolean
  /** Wraps the image in the brutalist bordered/hard-shadow frame. */
  bordered?: boolean
  className?: string
}

export function Image({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  priority,
  bordered = false,
  className,
}: ImageProps) {
  const image = (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={cx(styles.image, className)}
    />
  )

  if (!bordered) return image

  return <div className={styles.frame}>{image}</div>
}
