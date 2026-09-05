// PROTOTYPE, throwaway — the always-visible text list of Locations (per
// issue #15: primary content surface, keyboard access lives here, not on the
// map pins).

import { PROTOTYPE_LOCATIONS } from './prototype-data'
import styles from './location-list.module.css'

export function LocationList() {
  return (
    <ul role="list" className={styles.list}>
      {PROTOTYPE_LOCATIONS.map((loc) => (
        <li key={loc.id} className={styles.item}>
          <strong>{loc.name}</strong>
          <span>{loc.address}</span>
          <a href={loc.directionsUrl} target="_blank" rel="noopener noreferrer">
            Get directions
          </a>
        </li>
      ))}
    </ul>
  )
}
