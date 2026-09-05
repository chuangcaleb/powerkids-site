/**
 * Keyless Google Maps directions URL (Maps URLs API, not billed/metered).
 * Opens the native Google Maps app on mobile, falls back to browser.
 */
export function directionsLink(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
}
