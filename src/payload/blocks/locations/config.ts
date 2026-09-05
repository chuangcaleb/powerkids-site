import type { Block } from 'payload'

/**
 * Locations list + interactive map. No fields — content lives in
 * Site Settings > Locations, the same source `FooterContact` reads.
 */
export const Locations: Block = {
  slug: 'locations',
  interfaceName: 'LocationsBlock',
  labels: { singular: 'Locations', plural: 'Locations Blocks' },
  fields: [],
}
