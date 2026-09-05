import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './toggle-chip.module.css'

export type ToggleChipProps = {
  active: boolean
  shape?: 'pill' | 'segment'
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

/**
 * PROTOTYPE — throwaway. Mirrors the site's `Pill` tokens (pill-shadow,
 * pill-border-width, radius-pill, `--step--1`, inherited body font — `Pill`'s
 * own `font-family: var(--font-display)` is commented out already) but as an
 * actual interactive `<button>` with an active/pressed state. `Pill` itself
 * only ever renders a non-interactive span/anchor, so this borrows its look
 * rather than becoming a variant of it — recommend a real shared component
 * (not `Pill`, not the heavier-shadow `Button`) if this direction sticks.
 */
export function ToggleChip({
  active,
  shape = 'pill',
  className,
  children,
  ...rest
}: ToggleChipProps) {
  return (
    <button
      type="button"
      className={cx(styles.chip, styles[shape], className)}
      data-active={active}
      {...rest}
    >
      {children}
    </button>
  )
}
