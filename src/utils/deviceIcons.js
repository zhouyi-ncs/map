import L from 'leaflet'

/** @typedef {'idle'|'running'|'charging'|'error'} RobotStatus */
/** @typedef {'online'|'offline'|'recording'|'maintenance'} CameraStatus */
/** @typedef {'normal'|'warning'|'alarm'|'offline'} IotStatus */
/** @typedef {RobotStatus|CameraStatus|IotStatus} DeviceStatus */

/** @type {Record<string, string>} */
const STATUS_COLORS = {
  idle: '#94a3b8',
  running: '#22c55e',
  charging: '#3b82f6',
  error: '#ef4444',
  online: '#22c55e',
  offline: '#64748b',
  recording: '#a855f7',
  maintenance: '#f59e0b',
  normal: '#22c55e',
  warning: '#f59e0b',
  alarm: '#ef4444',
}

/** @type {Record<string, string>} */
const CATEGORY_ICONS = {
  robot: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h1a2 2 0 1 1 0 4h-1v1a2 2 0 1 1-4 0v-1h-8v1a2 2 0 1 1-4 0v-1H4a2 2 0 1 1 0-4h1v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M8 11a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1m8 0a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4"/></svg>`,
  iot: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93m6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39"/></svg>`,
}

/**
 * @param {{ category: string, status: string, name: string }} device
 * @returns {L.DivIcon}
 */
export function createDeviceIcon(device) {
  const color = STATUS_COLORS[device.status] ?? '#94a3b8'
  const icon = CATEGORY_ICONS[device.category] ?? CATEGORY_ICONS.iot

  return L.divIcon({
    className: 'device-marker',
    html: `
      <div class="device-marker-inner" style="--status-color: ${color}">
        <span class="device-marker-icon">${icon}</span>
        <span class="device-marker-pulse"></span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

/**
 * @param {string} status
 * @param {string} category
 * @returns {string}
 */
export function getStatusLabel(status, category) {
  const labels = {
    robot: {
      idle: 'Idle',
      running: 'Running',
      charging: 'Charging',
      error: 'Error',
    },
    camera: {
      online: 'Online',
      offline: 'Offline',
      recording: 'Recording',
      maintenance: 'Maintenance',
    },
    iot: {
      normal: 'Normal',
      warning: 'Warning',
      alarm: 'Alarm',
      offline: 'Offline',
    },
  }
  return labels[category]?.[status] ?? status
}
