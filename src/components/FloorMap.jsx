import { MapContainer, ImageOverlay } from 'react-leaflet'
import L from 'leaflet'
import { getMapBounds } from '../utils/coordinates.js'
import MapResizer from './MapResizer.jsx'
import RegionOverlay from './RegionOverlay.jsx'
import DeviceMarkers from './DeviceMarkers.jsx'

/**
 * @param {{
 *   mapNode: import('../data/mockData.js').MapNode,
 *   deviceFilter: string,
 *   onRegionClick: (targetNodeId: string) => void,
 * }} props
 */
export default function FloorMap({ mapNode, deviceFilter, onRegionClick }) {
  const { mapImage, mapSize } = mapNode
  const bounds = getMapBounds(mapSize)

  return (
    <MapContainer
      key={mapNode.id}
      crs={L.CRS.Simple}
      bounds={bounds}
      maxBounds={bounds}
      maxBoundsViscosity={1}
      zoomSnap={0.25}
      zoomDelta={0.5}
      className="floor-map"
      attributionControl={false}
      zoomControl={true}
    >
      <ImageOverlay url={mapImage} bounds={bounds} />
      <MapResizer mapSize={mapSize} />
      <RegionOverlay
        regions={mapNode.regions ?? []}
        onRegionClick={onRegionClick}
      />
      <DeviceMarkers
        devices={mapNode.devices ?? []}
        filter={deviceFilter}
      />
    </MapContainer>
  )
}
