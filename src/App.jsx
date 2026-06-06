import { useMapApp } from './hooks/useMapApp.js'
import FloorMap from './components/FloorMap.jsx'
import LocationFilter from './components/LocationFilter.jsx'
import DeviceFilter from './components/DeviceFilter.jsx'
import { getPathToNode } from './data/mockData.js'
import './App.css'

function App() {
  const {
    tree,
    currentNode,
    currentNodeId,
    deviceFilter,
    loading,
    setCurrentNodeId,
    setDeviceFilter,
    navigateToNode,
  } = useMapApp()

  const breadcrumb =
    tree && currentNodeId ? getPathToNode(tree, currentNodeId) : []

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Indoor Map</h1>
        {breadcrumb.length > 0 && (
          <nav className="breadcrumb" aria-label="Location breadcrumb">
            {breadcrumb.map((node, i) => (
              <span key={node.id} className="breadcrumb-item">
                {i > 0 && <span className="breadcrumb-sep">/</span>}
                <button
                  type="button"
                  className={`breadcrumb-link ${node.id === currentNodeId ? 'current' : ''}`}
                  disabled={!node.mapImage}
                  onClick={() => node.mapImage && setCurrentNodeId(node.id)}
                >
                  {node.name}
                </button>
              </span>
            ))}
          </nav>
        )}
      </header>

      <main className="map-wrapper">
        {tree && (
          <div className="map-filters">
            <LocationFilter
              tree={tree}
              currentNodeId={currentNodeId}
              onSelect={setCurrentNodeId}
            />
            <DeviceFilter value={deviceFilter} onChange={setDeviceFilter} />
          </div>
        )}

        {loading && (
          <div className="map-loading">
            <span className="loading-spinner" />
            Loading map...
          </div>
        )}

        {!loading && currentNode && (
          <FloorMap
            mapNode={currentNode}
            deviceFilter={deviceFilter}
            onRegionClick={navigateToNode}
          />
        )}
      </main>
    </div>
  )
}

export default App
