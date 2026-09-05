import { Mail, Phone } from 'lucide-react'
import { SiWhatsapp } from '@icons-pack/react-simple-icons'
import { Button } from '@/components/button/button'
import { cx } from '@/lib/cx'
import type { ReplyBy } from './use-enquiry-form-demo'
import styles from './reply-by-variants.module.css'

/** PROTOTYPE — throwaway. Three takes on the reply-by control, #29's least-settled piece. */

export type ReplyByVariantProps = {
  value: ReplyBy
  onChange: (value: ReplyBy) => void
  error?: string
}

const OPTIONS: { value: ReplyBy; label: string; Icon: typeof Phone }[] = [
  { value: 'whatsapp', label: 'WhatsApp', Icon: SiWhatsapp as unknown as typeof Phone },
  { value: 'call', label: 'Call', Icon: Phone },
  { value: 'email', label: 'Email', Icon: Mail },
]

function Footer({ error }: { error?: string }) {
  return error ? (
    <span className={styles.error} role="alert">
      {error}
    </span>
  ) : (
    <p className={styles.helper}>
      We can also send an email confirming we&apos;ve received your enquiry — add one
      above if you&apos;d like it.
    </p>
  )
}

/** R1 — the real `Button` component, no icons. Selected option is `variant="red"`, others `variant="outline"`. Email is always selectable; missing email is a validation error on submit, not a disabled control. */
export function ReplyByR1({ value, onChange, error }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>Reply by</span>
      <div className={styles.pillRow} role="group" aria-label="Reply by">
        {OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={value === option.value ? 'red' : 'outline'}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <Footer error={error} />
    </div>
  )
}

/** R2 — same, with a leading brand/lucide icon per option. */
export function ReplyByR2({ value, onChange, error }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>Reply by</span>
      <div className={styles.pillRow} role="group" aria-label="Reply by">
        {OPTIONS.map(({ value: optionValue, label, Icon }) => (
          <Button
            key={optionValue}
            type="button"
            size="sm"
            variant={value === optionValue ? 'red' : 'outline'}
            onClick={() => onChange(optionValue)}
          >
            <Icon size={16} aria-hidden="true" className={styles.buttonIcon} />
            {label}
          </Button>
        ))}
      </div>
      <Footer error={error} />
    </div>
  )
}

/** R3 — single joined segmented control, icons, no separate pill gaps. */
export function ReplyByR3({ value, onChange, error }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>Reply by</span>
      <div className={styles.segmentedR3} role="group" aria-label="Reply by">
        {OPTIONS.map(({ value: optionValue, label, Icon }) => (
          <button
            key={optionValue}
            type="button"
            className={cx(styles.segmentR3)}
            data-active={value === optionValue}
            onClick={() => onChange(optionValue)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <Footer error={error} />
    </div>
  )
}
