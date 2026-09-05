import { LocationsSection } from '@/components/locations-section/locations-section'
import type { LocationsBlock } from '@/payload-types'

export function Locations(_props: LocationsBlock) {
  return (
    <section id="locations" className="wrapper flow region">
      <LocationsSection />
    </section>
  )
}
