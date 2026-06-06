import { useState, useRef, useEffect } from 'react'

const FILTER_ICONS = {
  all: null,
  robot: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h1a2 2 0 1 1 0 4h-1v1a2 2 0 1 1-4 0v-1h-8v1a2 2 0 1 1-4 0v-1H4a2 2 0 1 1 0-4h1v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M8 11a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1m8 0a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4" />
    </svg>
  ),
  iot: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93m6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39" />
    </svg>
  ),
}

/** @type {{ id: string, label: string }[]} */
const OPTIONS = [
  { id: 'all', label: 'All devices' },
  { id: 'robot', label: 'Robots' },
  { id: 'camera', label: 'Camera' },
  { id: 'iot', label: 'IoT Devices' },
]

/**
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 * }} props
 */
export default function DeviceFilter({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = OPTIONS.find((o) => o.id === value) ?? OPTIONS[0]

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
        <span>{current.label}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div className="filter-panel device-panel">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`filter-option ${value === option.id ? 'active' : ''}`}
              onClick={() => {
                onChange(option.id)
                setOpen(false)
              }}
            >
              {FILTER_ICONS[option.id] && (
                <span className="filter-option-icon">
                  {FILTER_ICONS[option.id]}
                </span>
              )}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
