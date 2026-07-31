import NextImage from 'next/image'
import styles from './image.module.css'

export type ImageProps = {
  src: string
  alt: string
  width: number
  height: number
  /** Wraps the image in the brutalist bordered/hard-shadow frame. */
  bordered?: boolean
  className?: string
}

export function Image({
  src,
  alt,
  width,
  height,
  bordered = false,
  className,
}: ImageProps) {
  const image = (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={[styles.image, className].filter(Boolean).join(' ')}
    />
  )

  if (!bordered) return image

  return <div className={styles.frame}>{image}</div>
}
