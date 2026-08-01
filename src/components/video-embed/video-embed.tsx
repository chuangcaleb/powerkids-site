'use client'

import { useState } from 'react'
import { cx } from '@/lib/cx'
import styles from './video-embed.module.css'

export type VideoEmbedProps = {
  /** Full embed URL (e.g. YouTube/Vimeo embed link), loaded only after click. */
  embedUrl: string
  title: string
  posterUrl: string
  className?: string
}

/** Lazy-loaded facade — the iframe never loads until the editor clicks play. */
export function VideoEmbed({ embedUrl, title, posterUrl, className }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className={cx(styles.frame, className)}>
        <iframe
          className={styles.iframe}
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={cx(styles.frame, styles.poster, className)}
      style={{ backgroundImage: `url("${posterUrl}")` }}
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
    >
      <span className={styles.playIcon} aria-hidden="true" />
    </button>
  )
}
