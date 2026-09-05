// PROTOTYPE, wipe me — fake Locations, no real geocoordinates or CMS data.

export type PrototypeLocation = {
  id: string
  name: string
  address: string
  directionsUrl: string
  /** Fake pin position on the poster, percentage from top-left. */
  pin: { x: number; y: number }
}

export const PROTOTYPE_LOCATIONS: PrototypeLocation[] = [
  {
    id: 'sri-hartamas',
    name: 'Sri Hartamas',
    address: '12 Jalan Sri Hartamas 8, 50480 Kuala Lumpur',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=3.1637,101.6509',
    pin: { x: 32, y: 44 },
  },
  {
    id: 'bangsar',
    name: 'Bangsar',
    address: '5 Jalan Telawi 3, 59100 Kuala Lumpur',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=3.1319,101.6708',
    pin: { x: 58, y: 62 },
  },
  {
    id: 'mont-kiara',
    name: 'Mont Kiara',
    address: '2 Jalan Kiara, 50480 Kuala Lumpur',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=3.1725,101.6509',
    pin: { x: 71, y: 30 },
  },
]
