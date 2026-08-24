import type { CSSProperties } from 'react'

export type Accent = 'blue' | 'neutral' | 'red'

const ACCENT_VAR: Record<Accent, string> = {
  blue: 'var(--accent-blue)',
  neutral: 'var(--text-strong)',
  red: 'var(--accent-red)',
}

/**
 * Sets `--accent-color` once on a section's container element. Anything
 * nested inside — rich text emphasis marks, buttons, pills — reads the same
 * cascaded value instead of each one taking its own `accent` prop.
 */
export function accentStyle(accent?: Accent | null): CSSProperties {
  return { '--accent-color': ACCENT_VAR[accent ?? 'neutral'] } as CSSProperties
}

/** `Button` has no "neutral" variant of its own — `outline` is its neutral look. */
export function accentButtonVariant(accent?: Accent | null): 'blue' | 'outline' | 'red' {
  return accent === 'blue' || accent === 'red' ? accent : 'outline'
}
