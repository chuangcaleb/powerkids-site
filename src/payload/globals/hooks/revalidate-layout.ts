import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

/** `site-settings`/`navigation` feed the root layout — every route needs revalidating, not just one path. */
export const revalidateLayout: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating layout')
    revalidatePath('/', 'layout')
  }

  return doc
}
