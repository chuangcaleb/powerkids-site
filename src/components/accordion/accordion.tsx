'use client'

// Client component: Radix owns disclosure state, roving focus, and ARIA —
// no server equivalent.

import type { ReactNode } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cx } from '@/lib/cx'
import { primitiveVars } from '@/lib/primitive-vars'
import styles from './accordion.module.css'

export type AccordionItemData = {
  id: string
  trigger: ReactNode
  children: ReactNode
}

export type AccordionProps = {
  items: AccordionItemData[]
}

export function Accordion({ items }: AccordionProps) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cx('flow-s max-prose')}>
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.id} value={item.id} className={styles.item}>
          <AccordionPrimitive.Header className={styles.header}>
            <AccordionPrimitive.Trigger
              className={cx('repel', styles.trigger)}
              style={primitiveVars({
                '--repel-gap': 'var(--space-s)',
                '--repel-vertical-align': 'center',
              })}
            >
              {item.trigger}
              <span className={styles.icon} aria-hidden="true" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className={styles.panel}>
            <div className={styles.panelInner}>{item.children}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
