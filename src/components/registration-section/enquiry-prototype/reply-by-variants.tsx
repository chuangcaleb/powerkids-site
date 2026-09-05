import { Mail, Phone } from 'lucide-react'
import { SiWhatsapp } from '@icons-pack/react-simple-icons'
import { ToggleChip } from './toggle-chip'
import type { ReplyBy } from './use-enquiry-form-demo'
import styles from './reply-by-variants.module.css'

/** PROTOTYPE — throwaway. Three takes on the reply-by control, #29's least-settled piece. */

const LEGEND = 'How should we reply to you?'

export type ReplyByVariantProps = {
  value: ReplyBy
  onChange: (value: ReplyBy) => void
}

const OPTIONS: { value: ReplyBy; label: string; Icon: typeof Phone }[] = [
  { value: 'whatsapp', label: 'WhatsApp', Icon: SiWhatsapp as unknown as typeof Phone },
  { value: 'call', label: 'Call', Icon: Phone },
  { value: 'email', label: 'Email', Icon: Mail },
]

function Helper() {
  return (
    <p className={styles.helper}>
      Add an email address for us to send the confirmation email to.
    </p>
  )
}

/** R1 — `ToggleChip`, no icons. Email is always selectable; which of phone/email is required flips with the choice — see final-card.tsx. */
export function ReplyByR1({ value, onChange }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>{LEGEND}</span>
      <div className={styles.pillRow} role="group" aria-label={LEGEND}>
        {OPTIONS.map((option) => (
          <ToggleChip
            key={option.value}
            active={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </ToggleChip>
        ))}
      </div>
      <Helper />
    </div>
  )
}

/** R2 — same, with a leading brand/lucide icon per option. */
export function ReplyByR2({ value, onChange }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>{LEGEND}</span>
      <div className={styles.pillRow} role="group" aria-label={LEGEND}>
        {OPTIONS.map(({ value: optionValue, label, Icon }) => (
          <ToggleChip
            key={optionValue}
            active={value === optionValue}
            onClick={() => onChange(optionValue)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </ToggleChip>
        ))}
      </div>
      <Helper />
    </div>
  )
}

/** R3 — same chips, squarer "segment" shape, joined tighter. */
export function ReplyByR3({ value, onChange }: ReplyByVariantProps) {
  return (
    <div>
      <span className={styles.legend}>{LEGEND}</span>
      <div className={styles.segmentedR3} role="group" aria-label={LEGEND}>
        {OPTIONS.map(({ value: optionValue, label, Icon }) => (
          <ToggleChip
            key={optionValue}
            shape="segment"
            active={value === optionValue}
            onClick={() => onChange(optionValue)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </ToggleChip>
        ))}
      </div>
      <Helper />
    </div>
  )
}
