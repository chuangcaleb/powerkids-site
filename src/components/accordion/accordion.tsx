'use client'

// Client component: disclosure open/closed state plus roving-focus keyboard
// navigation both live in React state — no server equivalent.

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './accordion.module.css'

export type AccordionItemData = {
  id: string
  trigger: ReactNode
  children: ReactNode
}

export type AccordionProps = {
  items: AccordionItemData[]
  /** Whether more than one panel can stay open at once. Default: one at a time. */
  allowMultiple?: boolean
  className?: string
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = allowMultiple ? new Set(current) : new Set<string>()
      if (current.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1
    let target: number | null = null

    if (event.key === 'ArrowDown') target = index === last ? 0 : index + 1
    else if (event.key === 'ArrowUp') target = index === 0 ? last : index - 1
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = last

    if (target === null) return
    event.preventDefault()
    triggerRefs.current[target]?.focus()
  }

  return (
    <div className={cx('flow-s', className)}>
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id)
        const panelId = `accordion-panel-${item.id}`
        const triggerId = `accordion-trigger-${item.id}`

        return (
          <div key={item.id} className={styles.item}>
            <h3 className={styles.header}>
              <button
                ref={(el) => {
                  triggerRefs.current[index] = el
                }}
                id={triggerId}
                type="button"
                className={cx('repel', styles.trigger)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                {item.trigger}
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cx(styles.panel, isOpen && styles.panelOpen)}
            >
              <div className={styles.panelInner}>{item.children}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
