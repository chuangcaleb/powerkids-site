import { NavBar } from '@/components/nav-bar/nav-bar'
import { getNavigation } from '@/payload/globals/get-navigation'

export async function Header() {
  const navigation = await getNavigation()

  return <NavBar links={navigation.headerLinks ?? []} />
}
