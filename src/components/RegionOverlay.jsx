import { Polygon, Tooltip } from 'react-leaflet'
import { polygonToLatLng } from '../utils/coordinates.js'

/**
 * @param {{
 *   regions: import('../data/mockData.js').Region[],
 *   onRegionClick: (targetNodeId: string) => void,
 * }} props
 */
export default function RegionOverlay({ regions, onRegionClick }) {
  return (
    <>
      {regions.map((region) => (
        <Polygon
          key={region.id}
          positions={polygonToLatLng(region.polygon)}
          pathOptions={{
            color: '#38bdf8',
            weight: 2,
            fillColor: '#0ea5e9',
            fillOpacity: 0.15,
            dashArray: '6 4',
          }}
          eventHandlers={{
            click: () => {
              if (region.targetNodeId) {
                onRegionClick(region.targetNodeId)
              }
            },
            mouseover: (e) => {
              e.target.setStyle({ fillOpacity: 0.35 })
            },
            mouseout: (e) => {
              e.target.setStyle({ fillOpacity: 0.15 })
            },
          }}
        >
          {region.labelPosition && (
            <Tooltip
              permanent
              direction="center"
              className="region-label-tooltip"
            >
              <button
                type="button"
                className="region-enter-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  if (region.targetNodeId) {
                    onRegionClick(region.targetNodeId)
                  }
                }}
              >
                {region.name}
              </button>
            </Tooltip>
          )}
        </Polygon>
      ))}
    </>
  )
}
