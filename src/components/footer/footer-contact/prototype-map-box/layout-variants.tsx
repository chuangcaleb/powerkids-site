'use client'

// PROTOTYPE, throwaway — three structurally different placements for issue
// #18. Each mounts MapBoxFacade + LocationList differently relative to the
// real `wrapper` / `grid-auto max-prose` composition already used by
// FooterContact, so the width tension is visible, not described.

import { primitiveVars } from '@/lib/primitive-vars'
import { LocationList } from './location-list'
import { MapBoxFacade, type MapAffordance, type MapRatio } from './map-box-facade'
import styles from './layout-variants.module.css'

export type LayoutVariantProps = {
  ratio: MapRatio
  affordance: MapAffordance
}

/** A: map sits below the existing grid, inside the same wrapper (contained width). */
export function LayoutBelowGrid({ ratio, affordance }: LayoutVariantProps) {
  return (
    <div className={styles.belowGrid}>
      <div className="flow-xs">
        <h3 className={styles.label}>Our locations</h3>
        <LocationList />
      </div>
      <MapBoxFacade ratio={ratio} affordance={affordance} />
    </div>
  )
}
LayoutBelowGrid.variantName = 'Below the grid, contained'

/** B: map breaks out to full viewport width, ignoring the wrapper's max-width. */
export function LayoutFullBleed({ ratio, affordance }: LayoutVariantProps) {
  return (
    <div className={styles.fullBleedOuter}>
      <MapBoxFacade
        ratio={ratio}
        affordance={affordance}
        className={styles.fullBleedBox}
      />
      <div className="flow-xs wrapper">
        <h3 className={styles.label}>Our locations</h3>
        <LocationList />
      </div>
    </div>
  )
}
LayoutFullBleed.variantName = 'Full-bleed breakout'

/** C: map becomes a third cell in the existing grid-auto (same min-width rule). */
export function LayoutThirdCell({ ratio, affordance }: LayoutVariantProps) {
  return (
    <div
      className="grid-auto max-prose"
      style={primitiveVars({
        '--grid-gap': 'var(--space-xl)',
        '--grid-item-min':
          'max(var(--max-heading), calc((100% - var(--grid-gap, var(--space-l))) / 2))',
      })}
    >
      <div className="flow-xs">
        <h3 className={styles.label}>Opening hours</h3>
        <p>Mon&ndash;Fri, 8am&ndash;6pm</p>
      </div>
      <div className="flow-xs">
        <h3 className={styles.label}>Call us</h3>
        <p>+60 12-345 6789</p>
      </div>
      <div className={styles.thirdCell}>
        <h3 className={styles.label}>Our locations</h3>
        <LocationList />
        <MapBoxFacade ratio={ratio} affordance={affordance} />
      </div>
    </div>
  )
}
LayoutThirdCell.variantName = 'Third grid cell'
