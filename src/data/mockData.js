import floorMapImage from '../../assets/map.png'
import roomMapImage from '../../assets/zoom.png'

/** @typedef {'project'|'building'|'floor'|'room'} NodeType */
/** @typedef {'robot'|'camera'|'iot'} DeviceCategory */
/** @typedef {import('../utils/deviceIcons.js').DeviceStatus} DeviceStatus */

/**
 * @typedef {Object} MapNode
 * @property {string} id
 * @property {string} name
 * @property {NodeType} type
 * @property {string} [mapImage]
 * @property {{ width: number, height: number }} [mapSize]
 * @property {Region[]} [regions]
 * @property {Device[]} [devices]
 * @property {MapNode[]} [children]
 */

/**
 * @typedef {Object} Region
 * @property {string} id
 * @property {string} name
 * @property {string} [targetNodeId]
 * @property {[number, number][]} polygon
 * @property {string} [labelPosition]
 */

/**
 * @typedef {Object} Device
 * @property {string} id
 * @property {string} name
 * @property {DeviceCategory} category
 * @property {string} subtype
 * @property {DeviceStatus} status
 * @property {[number, number]} position
 */

/** @type {MapNode} */
export const locationTree = {
  id: 'root',
  name: 'Praxis All building',
  type: 'project',
  children: [
    {
      id: 'building-a',
      name: 'Building A',
      type: 'building',
      children: [
        {
          id: 'building-a-1f',
          name: '1F',
          type: 'floor',
          mapImage: floorMapImage,
          mapSize: { width: 1920, height: 1080 },
          regions: [
            {
              id: 'region-lobby-a',
              name: 'Lobby A',
              targetNodeId: 'lobby-a',
              polygon: [
                [120, 180],
                [120, 720],
                [520, 720],
                [520, 180],
              ],
              labelPosition: [320, 450],
            },
            {
              id: 'region-lobby-b',
              name: 'Lobby B',
              targetNodeId: 'lobby-b',
              polygon: [
                [560, 180],
                [560, 720],
                [960, 720],
                [960, 180],
              ],
              labelPosition: [760, 450],
            },
          ],
          devices: [
            {
              id: 'dev-1f-r01',
              name: 'Delivery Bot-01',
              category: 'robot',
              subtype: 'delivery_robot',
              status: 'running',
              position: [280, 350],
            },
            {
              id: 'dev-1f-r02',
              name: 'Cleaning Bot-02',
              category: 'robot',
              subtype: 'cleaning_robot',
              status: 'idle',
              position: [680, 520],
            },
            {
              id: 'dev-1f-c01',
              name: 'Entrance Cam-01',
              category: 'camera',
              subtype: 'dome_camera',
              status: 'online',
              position: [200, 200],
            },
            {
              id: 'dev-1f-c02',
              name: 'Hallway Cam-02',
              category: 'camera',
              subtype: 'bullet_camera',
              status: 'recording',
              position: [850, 300],
            },
            {
              id: 'dev-1f-i01',
              name: 'Temp Sensor-01',
              category: 'iot',
              subtype: 'sensor',
              status: 'normal',
              position: [450, 600],
            },
            {
              id: 'dev-1f-i02',
              name: 'Access Control-01',
              category: 'iot',
              subtype: 'access_control',
              status: 'warning',
              position: [750, 650],
            },
          ],
          children: [
            {
              id: 'lobby-a',
              name: 'Lobby A',
              type: 'room',
              mapImage: roomMapImage,
              mapSize: { width: 403, height: 326 },
              regions: [],
              devices: [
                {
                  id: 'dev-la-r01',
                  name: 'Lobby Bot-01',
                  category: 'robot',
                  subtype: 'patrol_robot',
                  status: 'idle',
                  position: [200, 160],
                },
                {
                  id: 'dev-la-c01',
                  name: 'Lobby Cam-01',
                  category: 'camera',
                  subtype: 'ptz_camera',
                  status: 'online',
                  position: [80, 60],
                },
                {
                  id: 'dev-la-i01',
                  name: 'Lighting-01',
                  category: 'iot',
                  subtype: 'lighting',
                  status: 'normal',
                  position: [320, 250],
                },
              ],
              children: [],
            },
            {
              id: 'lobby-b',
              name: 'Lobby B',
              type: 'room',
              mapImage: roomMapImage,
              mapSize: { width: 403, height: 326 },
              regions: [],
              devices: [
                {
                  id: 'dev-lb-c01',
                  name: 'Lobby Cam-02',
                  category: 'camera',
                  subtype: 'dome_camera',
                  status: 'offline',
                  position: [200, 100],
                },
                {
                  id: 'dev-lb-i01',
                  name: 'Air Sensor-01',
                  category: 'iot',
                  subtype: 'sensor',
                  status: 'alarm',
                  position: [150, 220],
                },
              ],
              children: [],
            },
          ],
        },
        {
          id: 'building-a-2f',
          name: '2F',
          type: 'floor',
          mapImage: floorMapImage,
          mapSize: { width: 1920, height: 1080 },
          regions: [
            {
              id: 'region-main-lobby',
              name: 'Main Lobby',
              targetNodeId: 'main-lobby',
              polygon: [
                [100, 200],
                [100, 600],
                [500, 600],
                [500, 200],
              ],
              labelPosition: [300, 400],
            },
            {
              id: 'region-meeting-room',
              name: 'Meeting Room',
              targetNodeId: 'meeting-room',
              polygon: [
                [540, 200],
                [540, 600],
                [900, 600],
                [900, 200],
              ],
              labelPosition: [720, 400],
            },
            {
              id: 'region-concierge',
              name: 'Concierge',
              targetNodeId: 'concierge',
              polygon: [
                [940, 200],
                [940, 600],
                [1300, 600],
                [1300, 200],
              ],
              labelPosition: [1120, 400],
            },
          ],
          devices: [
            {
              id: 'dev-2f-r01',
              name: 'Patrol Bot-03',
              category: 'robot',
              subtype: 'patrol_robot',
              status: 'charging',
              position: [350, 450],
            },
            {
              id: 'dev-2f-c01',
              name: 'Lobby Cam-03',
              category: 'camera',
              subtype: 'ptz_camera',
              status: 'maintenance',
              position: [700, 280],
            },
            {
              id: 'dev-2f-i01',
              name: 'Smart Lighting-02',
              category: 'iot',
              subtype: 'lighting',
              status: 'normal',
              position: [1100, 500],
            },
          ],
          children: [
            {
              id: 'main-lobby',
              name: 'Main Lobby',
              type: 'room',
              mapImage: roomMapImage,
              mapSize: { width: 403, height: 326 },
              regions: [],
              devices: [
                {
                  id: 'dev-ml-i01',
                  name: 'Env Sensor-01',
                  category: 'iot',
                  subtype: 'sensor',
                  status: 'normal',
                  position: [180, 180],
                },
              ],
              children: [],
            },
            {
              id: 'meeting-room',
              name: 'Meeting Room',
              type: 'room',
              mapImage: roomMapImage,
              mapSize: { width: 403, height: 326 },
              regions: [],
              devices: [
                {
                  id: 'dev-mr-c01',
                  name: 'Meeting Cam-01',
                  category: 'camera',
                  subtype: 'bullet_camera',
                  status: 'recording',
                  position: [200, 80],
                },
                {
                  id: 'dev-mr-i01',
                  name: 'AC Controller-01',
                  category: 'iot',
                  subtype: 'sensor',
                  status: 'warning',
                  position: [300, 240],
                },
              ],
              children: [],
            },
            {
              id: 'concierge',
              name: 'Concierge',
              type: 'room',
              mapImage: roomMapImage,
              mapSize: { width: 403, height: 326 },
              regions: [],
              devices: [
                {
                  id: 'dev-co-r01',
                  name: 'Service Bot-01',
                  category: 'robot',
                  subtype: 'delivery_robot',
                  status: 'error',
                  position: [200, 200],
                },
              ],
              children: [],
            },
          ],
        },
      ],
    },
  ],
}

/** @type {{ id: DeviceCategory|'all', label: string }[]} */
export const deviceFilterOptions = [
  { id: 'all', label: 'All devices' },
  { id: 'robot', label: 'Robots' },
  { id: 'camera', label: 'Camera' },
  { id: 'iot', label: 'IoT Devices' },
]

/** @type {Record<DeviceCategory, { id: string, label: string }[]>} */
export const deviceSubtypes = {
  robot: [
    { id: 'delivery_robot', label: 'Delivery Robot' },
    { id: 'cleaning_robot', label: 'Cleaning Robot' },
    { id: 'patrol_robot', label: 'Patrol Robot' },
  ],
  camera: [
    { id: 'dome_camera', label: 'Dome Camera' },
    { id: 'bullet_camera', label: 'Bullet Camera' },
    { id: 'ptz_camera', label: 'PTZ Camera' },
  ],
  iot: [
    { id: 'sensor', label: 'Sensor' },
    { id: 'access_control', label: 'Access Control' },
    { id: 'lighting', label: 'Smart Lighting' },
  ],
}

/**
 * @param {MapNode} node
 * @param {string} id
 * @returns {MapNode|null}
 */
export function findNodeById(node, id) {
  if (node.id === id) return node
  for (const child of node.children ?? []) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

/**
 * @param {MapNode} node
 * @param {string} targetId
 * @returns {MapNode[]}
 */
export function getPathToNode(node, targetId) {
  if (node.id === targetId) return [node]
  for (const child of node.children ?? []) {
    const path = getPathToNode(child, targetId)
    if (path.length) return [node, ...path]
  }
  return []
}

/**
 * @param {MapNode} node
 * @returns {MapNode[]}
 */
export function flattenTree(node) {
  const result = [node]
  for (const child of node.children ?? []) {
    result.push(...flattenTree(child))
  }
  return result
}

/**
 * @param {MapNode} node
 * @returns {MapNode[]}
 */
export function getSelectableMapNodes(node) {
  return flattenTree(node).filter(
    (n) => n.type === 'floor' || n.type === 'room',
  )
}
