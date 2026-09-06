import type { CollectionConfig } from 'payload'

import { anyone } from '@/payload/access/anyone'
import { authenticated, authenticatedFieldAccess } from '@/payload/access/authenticated'
import { validateField } from '@/lib/validate-enquiry'
import type { ReplyBy } from '@/lib/validate-enquiry'

import { sendEnquiryEmails } from './hooks/send-enquiry-emails'
import { stampClose } from './hooks/stamp-close'
import { stripStaffOnlyFields } from './hooks/strip-staff-only-fields'

const staffOnly = { access: { create: () => false } } as const

/**
 * Public enquiry-form submissions. Created only via the enquiry Server
 * Action (Local API, `overrideAccess: false`) — see spec §3. Submitted
 * fields are readonly forever in the admin panel; only `status` (phase 2)
 * is ever editable. `create` is public so the form can write directly, but
 * `stripStaffOnlyFields` is the real boundary keeping an anonymous caller
 * from setting the staff-only fields below.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['id', 'status', 'name', 'phone', 'enquiryTypeLabel', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: anyone,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [stripStaffOnlyFields, stampClose],
    afterChange: [sendEnquiryEmails],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 80,
      admin: { readOnly: true },
    },
    {
      name: 'phone',
      type: 'text',
      maxLength: 20,
      admin: {
        readOnly: true,
        width: '50%',
        description: 'Stored exactly as typed — no normalisation.',
      },
      validate: (
        value: unknown,
        { siblingData }: { siblingData: { replyBy?: ReplyBy } },
      ) => {
        return validateField('phone', String(value ?? ''), siblingData.replyBy) ?? true
      },
    },
    {
      name: 'email',
      type: 'text',
      maxLength: 254,
      admin: { readOnly: true, width: '50%' },
      validate: (
        value: unknown,
        { siblingData }: { siblingData: { replyBy?: ReplyBy } },
      ) => {
        return validateField('email', String(value ?? ''), siblingData.replyBy) ?? true
      },
    },
    {
      name: 'replyBy',
      type: 'radio',
      required: true,
      admin: { readOnly: true },
      options: [
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Call', value: 'call' },
        { label: 'Email', value: 'email' },
      ],
    },
    {
      name: 'enquiryTypeId',
      type: 'text',
      required: true,
      label: 'Enquiry type (row id)',
      admin: {
        readOnly: true,
        hidden: true,
        description:
          'Soft reference to cta.enquiry.types[].id — no referential integrity. Debug-only, query DB directly if needed.',
      },
    },
    {
      name: 'enquiryTypeLabel',
      type: 'text',
      required: true,
      label: 'Enquiry type (label)',
      admin: {
        readOnly: true,
        description:
          'Snapshotted at submit time, so a later-deleted type option still reads.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      maxLength: 1000,
      admin: { readOnly: true },
    },
    {
      name: 'confirmationFailed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Confirmation email failed',
      admin: { width: '50%' },
      ...staffOnly,
    },
    {
      name: 'adminNotificationFailed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Admin notification email failed',
      admin: { width: '50%' },
      ...staffOnly,
    },

    // Phase 2 — reserved now, unused until the admin follow-up UX ships.
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unread',
      options: [
        { label: 'Unread', value: 'unread' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        components: {
          Cell: '@/payload/admin/components/enquiries/status-cell#StatusCell',
        },
      },
      ...staffOnly,
    },
    {
      name: 'closedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true, width: '50%' },
      access: { create: () => false, read: authenticatedFieldAccess },
    },
    {
      name: 'closedAt',
      type: 'date',
      admin: { readOnly: true, width: '50%' },
      ...staffOnly,
    },
  ],
}
