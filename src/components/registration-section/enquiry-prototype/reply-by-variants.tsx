import { Mail, Phone } from 'lucide-react'
import { SiWhatsapp } from '@icons-pack/react-simple-icons'
import { cx } from '@/lib/cx'
import type { ReplyBy } from './use-enquiry-form-demo'
import styles from './reply-by-variants.module.css'

/** PROTOTYPE — throwaway. Three takes on the reply-by control, #29's least-settled piece. */

export type ReplyByVariantProps = {
  value: ReplyBy
  onChange: (value: ReplyBy) => void
  emailPresent: boolean
}

const OPTIONS: { value: ReplyBy; label: string; Icon: typeof Phone }[] = [
  { value: 'whatsapp', label: 'WhatsApp', Icon: SiWhatsapp as unknown as typeof Phone },
  { value: 'call', label: 'Call', Icon: Phone },
  { value: 'email', label: 'Email', Icon: Mail },
]

function Helper({ emailPresent }: { emailPresent: boolean }) {
  return (
    <p className={styles.helper}>
      {emailPresent
        ? "We'll send a confirmation to your email too."
        : "We can send an email to confirm we've received your enquiry, once you add one above."}
    </p>
  )
}

/** R1 — plain hard-shadow pills, no icons. */
export function ReplyByR1({ value, onChange, emailPresent }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>Reply by</span>
      <Helper emailPresent={emailPresent} />
      <div className={styles.pillRow} role="group" aria-label="Reply by">
        {OPTIONS.map((option) => {
          const disabled = option.value === 'email' && !emailPresent
          return (
            <button
              key={option.value}
              type="button"
              className={styles.pillR1}
              data-active={value === option.value}
              disabled={disabled}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** R2 — same hard-shadow pills, with a leading brand/lucide icon per option. */
export function ReplyByR2({ value, onChange, emailPresent }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>Reply by</span>
      <Helper emailPresent={emailPresent} />
      <div className={styles.pillRow} role="group" aria-label="Reply by">
        {OPTIONS.map(({ value: optionValue, label, Icon }) => {
          const disabled = optionValue === 'email' && !emailPresent
          return (
            <button
              key={optionValue}
              type="button"
              className={styles.pillR1}
              data-active={value === optionValue}
              disabled={disabled}
              onClick={() => onChange(optionValue)}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** R3 — single joined segmented control, icons + a lock affordance on the disabled Email segment. */
export function ReplyByR3({ value, onChange, emailPresent }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>Reply by</span>
      <Helper emailPresent={emailPresent} />
      <div className={styles.segmentedR3} role="group" aria-label="Reply by">
        {OPTIONS.map(({ value: optionValue, label, Icon }) => {
          const disabled = optionValue === 'email' && !emailPresent
          return (
            <button
              key={optionValue}
              type="button"
              className={cx(styles.segmentR3, disabled && styles.segmentR3Disabled)}
              data-active={value === optionValue}
              disabled={disabled}
              onClick={() => onChange(optionValue)}
              title={disabled ? 'Add an email above to enable this' : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
              {disabled ? (
                <svg className={styles.lockIcon} viewBox="0 0 16 16" aria-hidden="true">
                  <rect
                    x="3"
                    y="7"
                    width="10"
                    height="7"
                    rx="1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M5 7V5a3 3 0 0 1 6 0v2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
