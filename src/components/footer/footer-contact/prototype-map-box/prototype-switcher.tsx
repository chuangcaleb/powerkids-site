'use client'

// PROTOTYPE, throwaway — floating knob bar for issue #18. The variant is a
// prev/next cycle per the prototype skill's convention; ratio/affordance are
// secondary knobs shown as pill groups alongside it. Hidden in production.

import { useEffect } from 'react'
import { isProduction } from '@/lib/env'
import styles from './prototype-switcher.module.css'

export type VariantOption = { key: string; name: string }

export type KnobGroup<T extends string> = {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

export type PrototypeSwitcherProps = {
  variants: VariantOption[]
  currentVariant: string
  onVariantChange: (key: string) => void
  knobs: KnobGroup<string>[]
}

export function PrototypeSwitcher({
  variants,
  currentVariant,
  onVariantChange,
  knobs,
}: PrototypeSwitcherProps) {
  const index = Math.max(
    variants.findIndex((v) => v.key === currentVariant),
    0,
  )
  const current = variants[index]!

  function cycle(delta: number) {
    const next = (index + delta + variants.length) % variants.length
    onVariantChange(variants[next]!.key)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (target?.isContentEditable) return

      if (event.key === 'ArrowLeft') cycle(-1)
      if (event.key === 'ArrowRight') cycle(1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, variants])

  if (isProduction) return null

  return (
    <div className={styles.bar} role="toolbar" aria-label="Prototype knobs">
      <div className={styles.variantRow}>
        <button type="button" onClick={() => cycle(-1)} aria-label="Previous variant">
          ←
        </button>
        <span className={styles.variantLabel}>
          {current.key} ({current.name})
        </span>
        <button type="button" onClick={() => cycle(1)} aria-label="Next variant">
          →
        </button>
      </div>
      {knobs.map((group) => (
        <div key={group.label} className={styles.group}>
          <span className={styles.groupLabel}>{group.label}</span>
          <div className={styles.pills}>
            {group.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={styles.pill}
                data-active={option.value === group.value}
                onClick={() => group.onChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
