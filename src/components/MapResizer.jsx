import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { getMapBounds } from '../utils/coordinates.js'

/**
 * @param {{ width: number, height: number }} mapSize
 */
export default function MapResizer({ mapSize }) {
  const map = useMap()

  useEffect(() => {
    const bounds = getMapBounds(mapSize)
    map.fitBounds(bounds, { animate: false })
  }, [map, mapSize])

  return null
}
