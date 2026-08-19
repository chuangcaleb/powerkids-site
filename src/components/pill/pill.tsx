import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './pill.module.css'

type Variant = 'neutral' | 'red' | 'blue' | 'amber'

type CommonProps = {
  variant?: Variant
  children: ReactNode
  className?: string
}

type PillAsSpan = CommonProps &
  HTMLAttributes<HTMLSpanElement> & {
    href?: undefined
  }

type PillAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export type PillProps = PillAsSpan | PillAsLink

export function Pill({ variant = 'neutral', className, children, ...rest }: PillProps) {
  const classes = cx(styles.pill, styles[variant], className)

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
      {children}
    </span>
  )
}
