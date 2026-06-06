import { useState, useRef, useEffect } from 'react'
import { getPathToNode } from '../data/mockData.js'

const TYPE_ICONS = {
  project: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93m6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  floor: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M4 8h4V4H4v4m6 12h4v-4h-4v4m-6 0h4v-4H4v4m0-6h4v-4H4v4m6 4h4v-4h-4v4m6-12v4h4V4h-4m-6 4h4V4h-4v4m6 6h4v-4h-4v4m0 6h4v-4h-4v4" />
    </svg>
  ),
  room: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M3 3h8v8H3V3m10 0h8v8h-8V3M3 13h8v8H3v-8m10 0h8v8h-8v-8" />
    </svg>
  ),
}

/**
 * @param {{
 *   tree: import('../data/mockData.js').MapNode,
 *   currentNodeId: string,
 *   onSelect: (nodeId: string) => void,
 * }} props
 */
export default function LocationFilter({ tree, currentNodeId, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const currentPath = getPathToNode(tree, currentNodeId)
  const displayLabel =
    currentPath.length > 0
      ? currentPath[currentPath.length - 1].name
      : 'All building'

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="filter-dropdown" ref={ref}>
      <button
        type="button"
        className="filter-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{displayLabel}</span>
        <ChevronIcon />
      </button>

      {open && (
        <div className="filter-panel location-panel">
          <TreeNode
            node={tree}
            depth={0}
            currentNodeId={currentNodeId}
            onSelect={(id) => {
              onSelect(id)
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * @param {{
 *   node: import('../data/mockData.js').MapNode,
 *   depth: number,
 *   currentNodeId: string,
 *   onSelect: (nodeId: string) => void,
 * }} props
 */
function TreeNode({ node, depth, currentNodeId, onSelect }) {
  const isSelectable = node.type === 'floor' || node.type === 'room'
  const isActive = node.id === currentNodeId

  return (
    <>
      <button
        type="button"
        className={`tree-item ${isActive ? 'active' : ''} ${isSelectable ? 'selectable' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => {
          if (isSelectable) onSelect(node.id)
        }}
        disabled={!isSelectable}
      >
        <span className="tree-icon">{TYPE_ICONS[node.type]}</span>
        <span className="tree-label">{node.name}</span>
      </button>
      {(node.children ?? []).map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          currentNodeId={currentNodeId}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  )
}
