import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'

import styles from './staff-guide-view.module.css'

// Custom top-level views render bare (no DefaultTemplate) unless the view
// itself wraps its content — see @payloadcms/next Root/getRouteData.js,
// where `templateType` is only ever set for built-in routes.

const dirname = path.dirname(fileURLToPath(import.meta.url))
const content = fs.readFileSync(path.join(dirname, 'content.md'), 'utf-8')

// react-markdown renders plain tags with no classes attached — map the ones
// that need spacing onto the CSS module directly, since stylelint here
// doesn't recognise CSS Modules' `:global()` escape hatch.
const components: Components = {
  h1: (props) => <h1 className={styles.heading} {...props} />,
  h2: (props) => <h2 className={styles.heading} {...props} />,
  h3: (props) => <h3 className={styles.heading} {...props} />,
  li: (props) => <li className={styles.item} {...props} />,
  ol: (props) => <ol className={styles.block} {...props} />,
  p: (props) => <p className={styles.block} {...props} />,
  ul: (props) => <ul className={styles.block} {...props} />,
}

export const StaffGuideView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => (
  <DefaultTemplate
    i18n={initPageResult.req.i18n}
    locale={initPageResult.locale}
    params={params}
    payload={initPageResult.req.payload}
    permissions={initPageResult.permissions}
    searchParams={searchParams}
    user={initPageResult.req.user ?? undefined}
    visibleEntities={initPageResult.visibleEntities}
  >
    {/* Populates the breadcrumb trail; its leading icon is always a link back to /admin. */}
    <SetStepNav nav={[{ label: 'Staff Guide' }]} />
    <Gutter>
      <div className={styles.wrap}>
        <Markdown components={components}>{content}</Markdown>
      </div>
    </Gutter>
  </DefaultTemplate>
)
