'use client'

// Client component: reads `rowData` from the list-view table, which only
// exists in the browser.

import { SiWhatsapp } from '@icons-pack/react-simple-icons'
import { Mail, Phone } from 'lucide-react'
import type { DefaultCellComponentProps } from 'payload'

const ICONS = {
  whatsapp: SiWhatsapp,
  call: Phone,
  email: Mail,
} as const

/** Merges `phone`/`email` into one list-view column, keyed by `replyBy`. */
export const ContactCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
  const replyBy = rowData.replyBy as keyof typeof ICONS | undefined
  const value = replyBy === 'email' ? rowData.email : rowData.phone

  if (!replyBy || !value) return null

  const Icon = ICONS[replyBy]

  return (
    <span style={{ alignItems: 'center', display: 'inline-flex', gap: '0.4em' }}>
      <Icon size={14} aria-hidden="true" />
      {String(value)}
    </span>
  )
}
