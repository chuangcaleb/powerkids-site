export type MapCenterInput = { latitude: number; longitude: number }
export type MapCenterOutput = { latitude: number; longitude: number; zoom: number }

const NEUTRAL_CENTER: MapCenterOutput = { latitude: 0, longitude: 0, zoom: 1 }

/** Initial view: average of every Location's coordinates, zoomed to fit. */
export function mapCenter(locations: MapCenterInput[]): MapCenterOutput {
  if (locations.length === 0) return NEUTRAL_CENTER

  return {
    latitude: average(locations.map((l) => l.latitude)),
    longitude: average(locations.map((l) => l.longitude)),
    zoom: locations.length > 1 ? 10 : 14,
  }
}

function average(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}
