import { useState, useEffect, useCallback } from 'react'
import { fetchLocationTree, fetchMapDetail } from '../api/mockApi.js'
import { findNodeById } from '../data/mockData.js'

const DEFAULT_NODE_ID = 'building-a-1f'

/**
 * @returns {{
 *   tree: import('../data/mockData.js').MapNode | null,
 *   currentNode: import('../data/mockData.js').MapNode | null,
 *   currentNodeId: string,
 *   deviceFilter: string,
 *   loading: boolean,
 *   setCurrentNodeId: (id: string) => void,
 *   setDeviceFilter: (filter: string) => void,
 *   navigateToNode: (id: string) => void,
 * }}
 */
export function useMapApp() {
  const [tree, setTree] = useState(null)
  const [currentNodeId, setCurrentNodeId] = useState(DEFAULT_NODE_ID)
  const [currentNode, setCurrentNode] = useState(null)
  const [deviceFilter, setDeviceFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const navigateToNode = useCallback(
    async (nodeId) => {
      const node = tree ? findNodeById(tree, nodeId) : null
      if (tree && !node?.mapImage) return

      setLoading(true)
      setCurrentNodeId(nodeId)
      const detail = await fetchMapDetail(nodeId)
      setCurrentNode(detail)
      setLoading(false)
    },
    [tree],
  )

  useEffect(() => {
    let cancelled = false

    async function init() {
      const locationTree = await fetchLocationTree()
      if (cancelled) return
      setTree(locationTree)

      const detail = await fetchMapDetail(DEFAULT_NODE_ID)
      if (cancelled) return
      setCurrentNode(detail)
      setLoading(false)
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  return {
    tree,
    currentNode,
    currentNodeId,
    deviceFilter,
    loading,
    setCurrentNodeId: navigateToNode,
    setDeviceFilter,
    navigateToNode,
  }
}
