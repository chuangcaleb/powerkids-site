import { Heading } from '@/components/heading/heading'
import { Pill } from '@/components/pill/pill'
import {
  HeaderRichText,
  type HeaderRichTextProps,
} from '@/components/rich-text/header-rich-text'
import { lexicalHasText } from '@/lib/lexical-has-text'
import styles from './section-header.module.css'
import type { CSSProperties } from 'react'

type Level = 1 | 2 | 3 | 4 | 5 | 6

export type SectionHeaderData = {
  eyebrow?: string | null
  heading?: HeaderRichTextProps['data'] | null
  lead?: HeaderRichTextProps['data'] | null
  accent?: 'blue' | 'neutral' | 'red' | null
}

export type SectionHeaderProps = {
  header?: SectionHeaderData | null
  /** Semantic level of the heading — the block decides this, not the CMS. */
  level?: Level
  visualLevel?: Level
}

/** Whether `SectionHeader` would render anything — lets a block downgrade its own heading level when the section heading it would otherwise follow is absent, so the document outline never skips a level. */
export function hasSectionHeading(header?: SectionHeaderData | null): boolean {
  return Boolean(header?.eyebrow || lexicalHasText(header?.heading) || header?.lead)
}

export function SectionHeader({ header, level = 2, visualLevel }: SectionHeaderProps) {
  if (!header) return null
  const { eyebrow, lead, accent } = header
  const heading = lexicalHasText(header.heading) ? header.heading : null
  if (!eyebrow && !heading && !lead) return null

  return (
    <header className="flow-xs">
      {eyebrow ? <Pill variant={accent ?? 'neutral'}>{eyebrow}</Pill> : null}
      {heading ? (
        <Heading level={level} visualLevel={visualLevel}>
          <HeaderRichText data={heading} accent={accent} />
        </Heading>
      ) : null}
      {lead ? (
        <p
          className={`${styles.lead} max-lead`}
          style={{ '--flow-space': 'var(--space-m)' } as CSSProperties}
        >
          <HeaderRichText data={lead} accent={accent} />
        </p>
      ) : null}
    </header>
  )
}
