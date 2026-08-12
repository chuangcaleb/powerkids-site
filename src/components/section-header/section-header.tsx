import { Heading } from '@/components/heading/heading'
import { Pill } from '@/components/pill/pill'
import {
  HeaderRichText,
  type HeaderRichTextProps,
} from '@/components/rich-text/header-rich-text'
import styles from './section-header.module.css'

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

/**
 * Own `flow-s` rhythm, deliberately tighter than the section's own `flow` —
 * eyebrow/heading/lead read as one unit, not three loosely related
 * items at the section's larger spacing.
 */
export function SectionHeader({ header, level = 2, visualLevel }: SectionHeaderProps) {
  if (!header) return null
  const { eyebrow, heading, lead, accent } = header
  if (!eyebrow && !heading && !lead) return null

  return (
    <header className="flow-s">
      {eyebrow ? <Pill variant={accent ?? 'neutral'}>{eyebrow}</Pill> : null}
      {heading ? (
        <Heading level={level} visualLevel={visualLevel}>
          <HeaderRichText data={heading} accent={accent} />
        </Heading>
      ) : null}
      {lead ? (
        <p className={styles.lead}>
          <HeaderRichText data={lead} accent={accent} />
        </p>
      ) : null}
    </header>
  )
}
