import type { CollectionConfig } from 'payload'

import { anonymousOnly } from '@/payload/access/anonymous'
import { authenticated, authenticatedFieldAccess } from '@/payload/access/authenticated'
import { validateField } from '@/lib/validate-enquiry'
import type { ReplyBy } from '@/lib/validate-enquiry'

import { sendEnquiryEmails } from './hooks/send-enquiry-emails'
import { stampAdminTitle } from './hooks/stamp-admin-title'
import { stampClose } from './hooks/stamp-close'
import { stripStaffOnlyFields } from './hooks/strip-staff-only-fields'

const staffOnly = { access: { create: () => false } } as const

/**
 * Public enquiry-form submissions. Created only via the enquiry Server
 * Action (Local API, `overrideAccess: false`) — see spec §3. Submitted
 * fields are readonly forever in the admin panel; only `status` (phase 2)
 * is ever editable. `create` is anonymous-only so the form can write directly
 * but staff can't manually add records from the admin panel, and
 * `stripStaffOnlyFields` is the real boundary keeping an anonymous caller
 * from setting the staff-only fields below.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'adminTitle',
    defaultColumns: ['id', 'enquiryTypeLabel', 'status', 'name', 'contact', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: anonymousOnly,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [stripStaffOnlyFields, stampClose],
    afterChange: [sendEnquiryEmails, stampAdminTitle],
  },
  fields: [
    {
      type: 'row',
      fields: [
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
          label: 'Type',
          admin: {
            readOnly: true,
            width: '50%',
            description:
              'Snapshotted at submit time, so a later-deleted type option still reads.',
          },
        },
        // Phase 2 — reserved now, unused until the admin follow-up UX ships.
        // Not tri-state: "failed" is derived from `notificationErrors`, never a
        // stored status value — see CONTEXT.md.
        {
          name: 'status',
          type: 'select',
          defaultValue: 'unread',
          required: true,
          options: [
            { label: 'Unread', value: 'unread' },
            { label: 'Closed', value: 'closed' },
          ],
          admin: {
            width: '50%',
            components: {
              Cell: '@/payload/admin/components/enquiries/status-cell#StatusCell',
            },
          },
          ...staffOnly,
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      maxLength: 1000,
      admin: { readOnly: true },
    },

    {
      type: 'group',
      label: 'Follow-up contact information',
      fields: [
        {
          name: 'replyBy',
          type: 'radio',
          required: true,
          admin: { readOnly: true },
          options: [
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Phone Call', value: 'call' },
            { label: 'Email', value: 'email' },
          ],
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          maxLength: 80,
          admin: { readOnly: true },
        },
        {
          name: 'contact',
          type: 'ui',
          label: 'Contact',
          admin: {
            components: {
              Cell: '@/payload/admin/components/enquiries/contact-cell#ContactCell',
            },
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'phone',
              type: 'text',
              maxLength: 20,
              admin: {
                readOnly: true,
                width: '50%',
              },
              validate: (
                value: unknown,
                { siblingData }: { siblingData: { replyBy?: ReplyBy } },
              ) => {
                return (
                  validateField('phone', String(value ?? ''), siblingData.replyBy) ?? true
                )
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
                return (
                  validateField('email', String(value ?? ''), siblingData.replyBy) ?? true
                )
              },
            },
          ],
        },
      ],
    },

    {
      type: 'group',
      label: 'Closed',
      admin: {
        condition: (data) => data.status === 'closed',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'closedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                readOnly: true,
                width: '50%',
              },
              access: { create: () => false, read: authenticatedFieldAccess },
            },
            {
              name: 'closedAt',
              type: 'date',
              admin: {
                readOnly: true,
                width: '50%',
              },
              ...staffOnly,
            },
          ],
        },
      ],
    },
    {
      name: 'adminTitle',
      type: 'text',
      label: 'Admin title',
      admin: {
        readOnly: true,
        hidden: true,
        description:
          'System-set. Composed from id + type + name, stamped once on create.',
      },
      ...staffOnly,
    },
    {
      name: 'notificationErrors',
      type: 'json',
      defaultValue: [],
      label: 'Admin notification errors',
      admin: {
        readOnly: true,
        description:
          'System-set. Non-empty means the admin notification email failed to send.',
        condition: (data) =>
          data.status !== 'closed' && Boolean(data.notificationErrors?.length),
        components: {
          Field:
            '@/payload/admin/components/enquiries/notification-errors-field#NotificationErrorsField',
        },
      },
      typescriptSchema: [() => ({ type: 'array', items: { type: 'string' } })],
      ...staffOnly,
    },
  ],
}
