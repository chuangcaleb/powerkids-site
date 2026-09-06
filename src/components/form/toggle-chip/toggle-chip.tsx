import type { InputHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './toggle-chip.module.css'
import { primitiveVars } from '@/lib/primitive-vars'

export type ToggleChipProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  icon: ReactNode
  label: string
}

/**
 * Radio-shaped chip mirroring `Pill`'s tokens (shadow, border width, pill
 * radius, `font-body`) — not a `Pill` variant (`Pill` is contractually
 * non-interactive) and not `Button` (shadow reads too heavy for a toggle).
 * Renders a real `<input type="radio">`, visually hidden, so keyboard/
 * screen-reader semantics come for free.
 */
export function ToggleChip({ icon, label, className, ...rest }: ToggleChipProps) {
  return (
    <label
      className={cx('cluster', styles.chip, className)}
      style={primitiveVars({ '--cluster-gap': 'var(--space-2xs)' })}
    >
      <input type="radio" className={styles.input} {...rest} />
      <span className={styles.icon}>{icon}</span>
      {label}
    </label>
  )
}
