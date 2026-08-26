'use client'

import { useSyncExternalStore } from 'react'

import { Banner, useConfig, XIcon } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'

import styles from './staff-guide-link.module.css'

const DISMISSED_KEY = 'staff-guide-banner-dismissed'

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => localStorage.getItem(DISMISSED_KEY) === 'true'

// Banner starts hidden on the server render — nothing to compare against
// until the client can read localStorage, and hidden is the safer default.
const getServerSnapshot = () => true

const dismiss = () => {
  localStorage.setItem(DISMISSED_KEY, 'true')
  listeners.forEach((listener) => listener())
}

/** Dashboard entry point into the staff guide — dismissible, remembered per browser. */
export const StaffGuideLink: React.FC = () => {
  const { config } = useConfig()
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (dismissed) return null

  const guideURL = formatAdminURL({
    adminRoute: config.routes.admin,
    path: '/staff-guide',
  })

  return (
    <Banner type="info">
      <p className={styles.banner}>
        <span>
          New here, or forgot how to update the site?{' '}
          <a href={guideURL}>Read the staff guide</a>.
        </span>
        <button
          aria-label="Dismiss"
          className={styles.dismiss}
          onClick={dismiss}
          type="button"
        >
          <XIcon />
        </button>
      </p>
    </Banner>
  )
}
