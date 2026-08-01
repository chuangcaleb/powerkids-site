import { NavBar } from '@/components/nav-bar/nav-bar'
import { getNavigation } from '@/payload/globals/get-navigation'
import { getSiteSettings } from '@/payload/globals/get-site-settings'

export async function Header() {
  const [navigation, siteSettings] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
  ])

  return (
    <NavBar
      logo={siteSettings.name}
      links={(navigation.header ?? []).map((link) => ({
        href: link.url,
        label: link.label,
      }))}
    />
  )
}
