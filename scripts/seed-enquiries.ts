/**
 * Inserts a handful of sample Enquiry records for admin-panel design review
 * (Contact column, conditional errors/closed rows). Run with:
 *   pnpm payload run scripts/seed-enquiries.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

if (process.env.NODE_ENV === 'production') {
  throw new Error('seed-enquiries: refuses to run in production')
}

const payload = await getPayload({ config })

const samples = [
  {
    name: 'Aisyah Rahman',
    phone: '012-3456789',
    email: '',
    replyBy: 'whatsapp' as const,
    enquiryTypeId: 'enrolment',
    enquiryTypeLabel: 'Enrolment',
    message: 'Hi, do you have any openings for a 4-year-old in Puchong Utama?',
    status: 'unread' as const,
  },
  {
    name: 'Marcus Tan',
    phone: '019-8765432',
    email: '',
    replyBy: 'call' as const,
    enquiryTypeId: 'general',
    enquiryTypeLabel: 'General',
    message: 'What are your operating hours during the school holidays?',
    status: 'unread' as const,
    notificationErrors: ['send failed: connect ETIMEDOUT 203.0.113.5:465'],
  },
  {
    name: 'Priya Devi',
    phone: '',
    email: 'priya.devi@example.com',
    replyBy: 'email' as const,
    enquiryTypeId: 'enrolment',
    enquiryTypeLabel: 'Enrolment',
    message: 'Could you send me the fee structure for Sri Petaling?',
    status: 'closed' as const,
  },
]

for (const sample of samples) {
  const { status, notificationErrors, ...data } = sample

  const created = await payload.create({
    collection: 'enquiries',
    data,
    overrideAccess: true,
  })

  await payload.update({
    collection: 'enquiries',
    id: created.id,
    data: { status, notificationErrors: notificationErrors ?? [] },
    context: { systemWrite: true },
  })

  payload.logger.info(`seed-enquiries: created ${created.id} (${sample.name})`)
}

process.exit(0)
