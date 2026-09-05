'use client'

// Client component: click-to-load facade over a MapLibre map. The engine
// (263 KB gz) is fetched only on click, via the `mapLib` promise created
// inside the click handler — creating it at module scope would pull it into
// this component's own chunk and defeat the code-split.

import { ClickToLoadFacade } from '@/components/click-to-load-facade/click-to-load-facade'
import facadeStyles from '@/components/click-to-load-facade/click-to-load-facade.module.css'
import { cx } from '@/lib/cx'
import { directionsLink } from '@/lib/directions-link'
import type { MapLib } from '@vis.gl/react-maplibre'
import { Map } from '@vis.gl/react-maplibre'
import type { Map as MapInstance } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Pill } from '../pill/pill'
import styles from './locations-map.module.css'
import { mapCenter } from './map-center'

/**
 * Full-colour, legible against brand pins — chosen over `positron` in the
 * #18 prototype. A code constant, not a CMS field: it's a technical
 * endpoint, not editorial content.
 */
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/** Copied here by scripts/copy-maplibre-worker.mjs at predev/prebuild. */
const WORKER_URL = '/maplibre/maplibre-gl-worker.mjs'

export type LocationsMapLocation = {
  id: string
  name: string
  latitude: number
  longitude: number
}

export type LocationsMapProps = {
  locations: LocationsMapLocation[]
  posterUrl: string
  className?: string
}

type Status = 'idle' | 'loading' | 'loaded'

export function LocationsMap({ locations, posterUrl, className }: LocationsMapProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [mapLib, setMapLib] = useState<Promise<MapLib>>()
  const [mapModule, setMapModule] = useState<MapLib>()
  const [mapInstance, setMapInstance] = useState<MapInstance>()

  const handleClick = useCallback(() => {
    setStatus('loading')
    setMapLib(
      import('maplibre-gl').then((m) => {
        m.setWorkerUrl(WORKER_URL)
        setMapModule(m)
        return m
      }),
    )
  }, [])

  // DOM Markers (not a symbol layer, which hides colliding icons at low
  // zoom) attached imperatively so each one binds a real maplibre Popup via
  // `setPopup` — that native binding is what gives the marker element
  // role="button", a managed tabindex, and a keyboard-reachable popup for
  // free. Popup content still renders through React (`createRoot` per
  // marker), so CMS strings stay text nodes rather than raw HTML.
  useEffect(() => {
    if (!mapInstance || !mapModule) return

    const bound = locations.map((location) => {
      const container = document.createElement('div')
      const root = createRoot(container)
      root.render(
        <>
          <p className={styles.popupName}>{location.name}</p>
          <a
            href={directionsLink(location.latitude, location.longitude)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </a>
        </>,
      )

      const popup = new mapModule.Popup({ closeButton: false, offset: 24 }).setDOMContent(
        container,
      )
      const marker = new mapModule.Marker({ color: 'var(--accent-red)' })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(mapInstance)
      // Overrides maplibre's generic default ("Map marker") with the
      // Location's own name.
      marker.getElement().setAttribute('aria-label', location.name)

      return { marker, root }
    })

    return () => {
      for (const { marker, root } of bound) {
        marker.remove()
        root.unmount()
      }
    }
  }, [mapInstance, mapModule, locations])

  if (status === 'idle') {
    return (
      <ClickToLoadFacade
        posterUrl={posterUrl}
        ariaLabel="Show interactive map"
        onClick={handleClick}
        className={className}
      >
        <Pill>Show interactive map</Pill>
      </ClickToLoadFacade>
    )
  }

  return (
    <div className={cx(facadeStyles.frame, className)}>
      {status === 'loading' ? (
        <div className={styles.spinner} aria-hidden="true" />
      ) : null}
      <Map
        mapLib={mapLib}
        mapStyle={STYLE_URL}
        attributionControl={{ compact: true }}
        initialViewState={mapCenter(locations)}
        onLoad={(e) => {
          setStatus('loaded')
          setMapInstance(e.target)
        }}
      />
    </div>
  )
}
