'use client'

// Client component: takes a click handler, so any server-component ancestor
// couldn't pass one across the boundary — this stays a leaf client component
// even though it holds no state of its own.

import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './click-to-load-facade.module.css'

export type ClickToLoadFacadeProps = {
  /** Background image shown until clicked. */
  posterUrl: string
  ariaLabel: string
  onClick: () => void
  /** The affordance rendered over the poster (play icon, pill label, etc). */
  children: ReactNode
  className?: string
}

/**
 * Bordered 16:9 poster button — the shared shape behind every click-to-load
 * embed (video, map). Costs nothing until clicked; the payload it unlocks is
 * the caller's job, not this component's.
 */
export function ClickToLoadFacade({
  posterUrl,
  ariaLabel,
  onClick,
  children,
  className,
}: ClickToLoadFacadeProps) {
  return (
    <button
      type="button"
      className={cx(styles.frame, styles.poster, className)}
      style={{ backgroundImage: `url("${posterUrl}")` }}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
