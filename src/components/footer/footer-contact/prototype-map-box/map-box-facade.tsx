'use client'

// PROTOTYPE, throwaway — answers issue #18 (layout + facade behaviour), not a
// real MapLibre mount. Pins are fake percentage-positioned dots on an SVG
// poster; "mounted" state is a mock, not maplibre-gl.

import { useState } from 'react'
import { cx } from '@/lib/cx'
import { PROTOTYPE_LOCATIONS } from './prototype-data'
import styles from './map-box-facade.module.css'

export type MapRatio = 'video' | 'square' | 'wide'
export type MapAffordance = 'button' | 'badge' | 'border'

export type MapBoxFacadeProps = {
  ratio: MapRatio
  affordance: MapAffordance
  className?: string
}

const RATIO_VALUE: Record<MapRatio, string> = {
  video: '16 / 9',
  square: '1 / 1',
  wide: '21 / 9',
}

const POSTER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%23dcecff'/%3E%3Cpath d='M0 260 Q160 210 320 250 T640 230' stroke='%23aecbf2' stroke-width='18' fill='none'/%3E%3Cpath d='M0 120 Q220 60 640 140' stroke='%23c9dffb' stroke-width='10' fill='none'/%3E%3C/svg%3E"

export function MapBoxFacade({ ratio, affordance, className }: MapBoxFacadeProps) {
  const [state, setState] = useState<'poster' | 'loading' | 'mounted'>('poster')
  const [activePin, setActivePin] = useState<string | null>(null)

  function handleActivate() {
    if (state !== 'poster') return
    setState('loading')
    setTimeout(() => setState('mounted'), 650)
  }

  return (
    <div
      className={cx(styles.box, className)}
      style={{ aspectRatio: RATIO_VALUE[ratio] }}
      data-state={state}
    >
      {state !== 'mounted' ? (
        <button
          type="button"
          className={cx(styles.poster, styles[`affordance-${affordance}`])}
          style={{ backgroundImage: `url("${POSTER_SVG}")` }}
          onClick={handleActivate}
          aria-label="Load interactive map of our three locations"
        >
          {affordance === 'button' && (
            <span className={styles.playPill}>
              <span className={styles.playIcon} aria-hidden="true" />
              Show interactive map
            </span>
          )}
          {affordance === 'badge' && (
            <span className={styles.badge}>Click to explore ↗</span>
          )}
          {affordance === 'border' && (
            <span className={styles.caption}>Tap to load interactive map</span>
          )}
          {state === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
        </button>
      ) : (
        <div className={styles.mounted}>
          <div
            className={styles.mapMock}
            style={{ backgroundImage: `url("${POSTER_SVG}")` }}
          >
            {PROTOTYPE_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={styles.pin}
                style={{ left: `${loc.pin.x}%`, top: `${loc.pin.y}%` }}
                onClick={() => setActivePin(activePin === loc.id ? null : loc.id)}
                aria-label={`${loc.name} — show details`}
              />
            ))}
            {activePin && (
              <div className={styles.popup}>
                {(() => {
                  const loc = PROTOTYPE_LOCATIONS.find((l) => l.id === activePin)
                  if (!loc) return null
                  return (
                    <>
                      <strong>{loc.name}</strong>
                      <a
                        href={loc.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get directions
                      </a>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
