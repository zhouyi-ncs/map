/**
 * 设备点击事件占位处理 — 后续按业务需求替换
 * @param {import('../data/mockData.js').Device} device
 */
export function handleDeviceClick(device) {
  const handlers = {
    robot: handleRobotClick,
    camera: handleCameraClick,
    iot: handleIotClick,
  }

  const handler = handlers[device.category]
  if (handler) {
    handler(device)
  } else {
    console.log('[Device] Unknown category:', device)
  }
}

/** @param {import('../data/mockData.js').Device} device */
function handleRobotClick(device) {
  switch (device.status) {
    case 'running':
      console.log(`[Robot] Track live path: ${device.name} (${device.id})`)
      break
    case 'idle':
      console.log(`[Robot] Dispatch task panel: ${device.name} (${device.id})`)
      break
    case 'charging':
      console.log(`[Robot] View charging status: ${device.name} (${device.id})`)
      break
    case 'error':
      console.log(`[Robot] Open fault detail: ${device.name} (${device.id})`)
      break
    default:
      console.log(`[Robot] Default action: ${device.name}`)
  }
}

/** @param {import('../data/mockData.js').Device} device */
function handleCameraClick(device) {
  switch (device.status) {
    case 'online':
      console.log(`[Camera] Open live stream: ${device.name} (${device.id})`)
      break
    case 'recording':
      console.log(`[Camera] View recording: ${device.name} (${device.id})`)
      break
    case 'offline':
      console.log(`[Camera] Show offline diagnostics: ${device.name} (${device.id})`)
      break
    case 'maintenance':
      console.log(`[Camera] View maintenance log: ${device.name} (${device.id})`)
      break
    default:
      console.log(`[Camera] Default action: ${device.name}`)
  }
}

/** @param {import('../data/mockData.js').Device} device */
function handleIotClick(device) {
  switch (device.status) {
    case 'normal':
      console.log(`[IoT] View device metrics: ${device.name} (${device.id})`)
      break
    case 'warning':
      console.log(`[IoT] Show warning details: ${device.name} (${device.id})`)
      break
    case 'alarm':
      console.log(`[IoT] Trigger alarm response: ${device.name} (${device.id})`)
      break
    case 'offline':
      console.log(`[IoT] Device reconnect panel: ${device.name} (${device.id})`)
      break
    default:
      console.log(`[IoT] Default action: ${device.name}`)
  }
}
