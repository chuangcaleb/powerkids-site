import { LocationsMap } from '@/components/locations-map/locations-map'
import { cx } from '@/lib/cx'
import { directionsLink } from '@/lib/directions-link'
import { primitiveVars } from '@/lib/primitive-vars'
import { getSiteSettings } from '@/payload/globals/get-site-settings'
import { MapPin } from 'lucide-react'
import styles from './locations-section.module.css'

/** Locations list + click-to-load map, sourced from the site-settings global. */
export async function LocationsSection() {
  const siteSettings = await getSiteSettings()
  const locations = siteSettings.locations ?? []
  if (locations.length === 0) return null

  const posterAsset =
    typeof siteSettings.locationsMapPoster === 'object'
      ? siteSettings.locationsMapPoster
      : null

  return (
    <>
      <div className="flow-xl">
        <h2>Locations</h2>
        <ul role="list" className="flow-m max-lead">
          {locations.map((location) => (
            <li key={location.id ?? location.name} className="flow-3xs">
              <p
                className={cx(styles.locationName, 'cluster')}
                style={primitiveVars({ '--cluster-gap': 'var(--space-2xs)' })}
              >
                <MapPin />
                {location.name}
              </p>
              <p className={styles.locationAddress}>{location.address}</p>
              <a
                href={directionsLink(location.latitude, location.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsLink}
              >
                Get directions
              </a>
            </li>
          ))}
        </ul>
      </div>
      {posterAsset?.url ? (
        <LocationsMap
          locations={locations.map((location) => ({
            id: location.id ?? location.name,
            name: location.name,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
          }))}
          posterUrl={posterAsset.url}
          className={styles.mapBleed}
        />
      ) : null}
    </>
  )
}
