import type { AnchorHTMLAttributes } from 'react'
import { pathForSlug } from '@/lib/page-path'
import type { Page } from '@/payload-types'

/**
 * Stored shape of the `linkField()` group. Declared here rather than derived
 * from a block's generated type: this renderer serves every block that uses
 * the field, so hanging it off one of them (`ContentBlock['columns']`) made the
 * second caller a type fight.
 */
export type LinkValue = {
  type?: ('reference' | 'custom') | null
  newTab?: boolean | null
  reference?: (number | null) | Page
  url?: string | null
  label: string
  appearance?: ('default' | 'outline') | null
}

export type CMSLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  link: LinkValue
}

/** Resolves the `linkField()` group into an `<a>`. No appearance styling yet — plain anchor only. */
export function CMSLink({ link, className, ...rest }: CMSLinkProps) {
  const { type, newTab, reference, url, label } = link

  const href =
    type === 'custom'
      ? url
      : typeof reference === 'object' && reference !== null
        ? pathForSlug(reference.slug)
        : undefined

  if (!href) return null

  return (
    <a
      href={href}
      className={className}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {label}
    </a>
  )
}
