import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './heading.module.css'

type Level = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingProps = {
  /** Semantic level — determines the rendered tag, for document outline. */
  level: Level
  /** Visual size step, when it should differ from the semantic level. */
  visualLevel?: Level
  children: ReactNode
  className?: string
}

export function Heading({
  level,
  visualLevel = level,
  children,
  className,
}: HeadingProps) {
  const Tag = `h${level}` as const
  const classes = cx(styles.heading, styles[`size${visualLevel}`], className)

  return <Tag className={classes}>{children}</Tag>
}
