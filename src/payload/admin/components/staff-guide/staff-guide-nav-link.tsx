import { Link, NavGroup } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import type { ServerProps } from 'payload'

// NavGroup gives the same collapsible-section chrome as the built-in
// Settings/Content groups, which is what visually separates this from the
// collection/global links above it — no custom CSS needed.
export const StaffGuideNavLink: React.FC<ServerProps> = ({ payload }) => {
  const href = formatAdminURL({
    adminRoute: payload.config.routes.admin,
    path: '/staff-guide',
  })

  return (
    <NavGroup label="Help">
      <Link className="nav__link" href={href} prefetch={false}>
        <span className="nav__link-label">Staff Guide</span>
      </Link>
    </NavGroup>
  )
}
