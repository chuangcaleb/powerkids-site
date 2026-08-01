import { NavBar } from '@/components/nav-bar/nav-bar'
import { getSiteSettings } from '@/payload/globals/get-site-settings'

export async function Header() {
  const siteSettings = await getSiteSettings()

  return <NavBar logo={siteSettings.name} />
}
