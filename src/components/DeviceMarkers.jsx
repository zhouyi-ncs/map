import { Marker, Popup } from 'react-leaflet'
import { createDeviceIcon, getStatusLabel } from '../utils/deviceIcons.js'
import { handleDeviceClick } from '../utils/deviceHandlers.js'
import { pixelToLatLng } from '../utils/coordinates.js'
import { deviceSubtypes } from '../data/mockData.js'

/**
 * @param {{
 *   devices: import('../data/mockData.js').Device[],
 *   filter: string,
 * }} props
 */
export default function DeviceMarkers({ devices, filter }) {
  const filtered =
    filter === 'all'
      ? devices
      : devices.filter((d) => d.category === filter)

  return (
    <>
      {filtered.map((device) => {
        const subtypeLabel =
          deviceSubtypes[device.category]?.find((s) => s.id === device.subtype)
            ?.label ?? device.subtype

        return (
          <Marker
            key={device.id}
            position={pixelToLatLng(device.position)}
            icon={createDeviceIcon(device)}
            eventHandlers={{
              click: () => handleDeviceClick(device),
            }}
          >
            <Popup className="device-popup">
              <div className="device-popup-content">
                <strong>{device.name}</strong>
                <span className="device-popup-type">{subtypeLabel}</span>
                <span
                  className="device-popup-status"
                  data-status={device.status}
                >
                  {getStatusLabel(device.status, device.category)}
                </span>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}
