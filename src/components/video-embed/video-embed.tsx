'use client'

// Client component: click-to-load facade. The iframe is only mounted after a
// user click, so the third-party embed costs nothing until asked for.

import { useState } from 'react'
import { ClickToLoadFacade } from '@/components/click-to-load-facade/click-to-load-facade'
import facadeStyles from '@/components/click-to-load-facade/click-to-load-facade.module.css'
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
      <div className={cx(facadeStyles.frame, className)}>
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
    <ClickToLoadFacade
      posterUrl={posterUrl}
      ariaLabel={`Play video: ${title}`}
      onClick={() => setPlaying(true)}
      className={className}
    >
      <span className={styles.playIcon} aria-hidden="true" />
    </ClickToLoadFacade>
  )
}
