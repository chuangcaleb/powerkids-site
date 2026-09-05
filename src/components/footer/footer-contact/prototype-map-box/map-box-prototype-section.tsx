'use client'

// PROTOTYPE, throwaway — answers issue #18. Mounted inside the kitchen-sink
// dev sandbox (existing real page, real design tokens/compositions), not a
// new top-level route, since FooterContact itself is a server component
// fetching live CMS globals and isn't wired for `?variant=` search params.
//
// Capture on resolution: fold the winning layout + knob values into
// `FooterContact`/`footer-contact.module.css`, then drop this whole
// directory from main and push it to the `prototype/map-box-layout` branch.

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutBelowGrid, LayoutFullBleed, LayoutThirdCell } from './layout-variants'
import type { MapAffordance, MapRatio } from './map-box-facade'
import { PrototypeSwitcher } from './prototype-switcher'

const VARIANTS = {
  A: { name: LayoutBelowGrid.variantName, Component: LayoutBelowGrid },
  B: { name: LayoutFullBleed.variantName, Component: LayoutFullBleed },
  C: { name: LayoutThirdCell.variantName, Component: LayoutThirdCell },
} as const

type VariantKey = keyof typeof VARIANTS

export function MapBoxPrototypeSection() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const variant = (searchParams.get('mapVariant') as VariantKey) ?? 'A'
  const ratio = (searchParams.get('mapRatio') as MapRatio) ?? 'video'
  const affordance = (searchParams.get('mapAffordance') as MapAffordance) ?? 'button'

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString())
      next.set(key, value)
      router.replace(`?${next.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const { Component } = VARIANTS[variant] ?? VARIANTS.A

  return (
    <div style={{ position: 'relative' }}>
      <Component ratio={ratio} affordance={affordance} />
      <PrototypeSwitcher
        variants={Object.entries(VARIANTS).map(([key, v]) => ({ key, name: v.name }))}
        currentVariant={variant}
        onVariantChange={(key) => setParam('mapVariant', key)}
        knobs={[
          {
            label: 'ratio',
            value: ratio,
            options: [
              { value: 'video', label: '16:9' },
              { value: 'square', label: '1:1' },
              { value: 'wide', label: '21:9' },
            ],
            onChange: (value) => setParam('mapRatio', value),
          },
          {
            label: 'affordance',
            value: affordance,
            options: [
              { value: 'button', label: 'Play pill' },
              { value: 'badge', label: 'Corner badge' },
              { value: 'border', label: 'Hover border' },
            ],
            onChange: (value) => setParam('mapAffordance', value),
          },
        ]}
      />
    </div>
  )
}
