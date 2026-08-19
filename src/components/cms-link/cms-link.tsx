import type { AnchorHTMLAttributes } from 'react'
import { pathForSlug } from '@/lib/page-path'
import type { ContentBlock } from '@/payload-types'

type LinkField = NonNullable<NonNullable<ContentBlock['columns']>[number]['link']>

export type CMSLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  link: LinkField
}

/** Resolves the `link()` field group into an `<a>`. No appearance styling yet — plain anchor only. */
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
