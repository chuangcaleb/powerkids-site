import {
  SectionHeader,
  type SectionHeaderData,
} from '@/components/section-header/section-header'
import styles from './no-js-fallback.module.css'

/** PROTOTYPE — throwaway. Stands in for a real `<noscript>` block: JS is required (bot defence lives client-side), so this is the only copy a no-JS visitor ever sees. */
export function NoJsFallback({ header }: { header?: SectionHeaderData | null }) {
  return (
    <div className="flow max-prose">
      <SectionHeader header={header} />
      <p className={styles.copy}>
        Enable JavaScript to load this form, or reach us through the contact information
        below.
      </p>
    </div>
  )
}
