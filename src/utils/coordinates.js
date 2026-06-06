/**
 * 像素坐标 [x, y] 转为 Leaflet CRS.Simple 坐标 [lat, lng] => [y, x]
 * @param {[number, number]} point
 * @returns {[number, number]}
 */
export function pixelToLatLng([x, y]) {
  return [y, x]
}

/**
 * @param {[number, number][]} polygon
 * @returns {[number, number][]}
 */
export function polygonToLatLng(polygon) {
  return polygon.map(pixelToLatLng)
}

/**
 * @param {{ width: number, height: number }} mapSize
 * @returns {[[number, number], [number, number]]}
 */
export function getMapBounds(mapSize) {
  return [
    [0, 0],
    [mapSize.height, mapSize.width],
  ]
}
