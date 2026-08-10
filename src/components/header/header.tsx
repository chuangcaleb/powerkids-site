import { NavBar } from '@/components/nav-bar/nav-bar'
import { getNavigation } from '@/payload/globals/get-navigation'
import { getSiteSettings } from '@/payload/globals/get-site-settings'

export async function Header() {
  const [siteSettings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ])

  return <NavBar logo={siteSettings.name} links={navigation.headerLinks ?? []} />
}
