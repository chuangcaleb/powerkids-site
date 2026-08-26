/**
 * Creates or updates the permanent dev admin account, so owner and agents
 * share one login without it living in .env. Run with:
 *   pnpm payload run scripts/seed-admin.ts
 *
 * Credential source is `.agents/secrets/dev-admin.json`, written by
 * `scripts/sync-dev-admin.sh` (see docs/workflows/environments.md).
 */
import { readFileSync } from 'node:fs'
import config from '@payload-config'
import { getPayload } from 'payload'

if (process.env.NODE_ENV === 'production') {
  throw new Error('seed-admin: refuses to run in production')
}

const CREDENTIAL_FILE = '.agents/secrets/dev-admin.json'

const { name, email, password } = JSON.parse(readFileSync(CREDENTIAL_FILE, 'utf-8'))

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
})

const [existingUser] = existing.docs

if (existingUser) {
  await payload.update({
    collection: 'users',
    id: existingUser.id,
    data: { name, password },
  })
  payload.logger.info(`seed-admin: updated existing user ${email}`)
} else {
  await payload.create({
    collection: 'users',
    data: { name, email, password, role: 'admin' },
  })
  payload.logger.info(`seed-admin: created user ${email}`)
}

process.exit(0)
