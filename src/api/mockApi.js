import {
  locationTree,
  findNodeById,
  getPathToNode,
  deviceFilterOptions,
  deviceSubtypes,
} from '../data/mockData.js'

const MOCK_DELAY = 300

function delay(ms = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 获取完整位置树
 * @returns {Promise<import('../data/mockData.js').MapNode>}
 */
export async function fetchLocationTree() {
  await delay()
  return structuredClone(locationTree)
}

/**
 * 获取指定节点的地图详情（含区域与设备）
 * @param {string} nodeId
 * @returns {Promise<import('../data/mockData.js').MapNode|null>}
 */
export async function fetchMapDetail(nodeId) {
  await delay()
  const node = findNodeById(locationTree, nodeId)
  if (!node || !node.mapImage) return null
  return structuredClone(node)
}

/**
 * 获取从根到目标节点的路径（面包屑）
 * @param {string} nodeId
 * @returns {Promise<import('../data/mockData.js').MapNode[]>}
 */
export async function fetchNodePath(nodeId) {
  await delay(150)
  return structuredClone(getPathToNode(locationTree, nodeId))
}

/**
 * 获取设备筛选选项
 * @returns {Promise<{ id: string, label: string }[]>}
 */
export async function fetchDeviceFilterOptions() {
  await delay(100)
  return structuredClone(deviceFilterOptions)
}

/**
 * 获取设备子类型字典
 * @returns {Promise<Record<string, { id: string, label: string }[]>>}
 */
export async function fetchDeviceSubtypes() {
  await delay(100)
  return structuredClone(deviceSubtypes)
}

/**
 * 获取单个设备详情
 * @param {string} deviceId
 * @param {string} [nodeId]
 * @returns {Promise<import('../data/mockData.js').Device|null>}
 */
export async function fetchDeviceDetail(deviceId, nodeId) {
  await delay()
  const searchNode = nodeId
    ? findNodeById(locationTree, nodeId)
    : locationTree

  if (!searchNode) return null

  const devices = searchNode.devices ?? []
  const device = devices.find((d) => d.id === deviceId)
  return device ? structuredClone(device) : null
}
