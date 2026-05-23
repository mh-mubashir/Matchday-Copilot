import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet'

/**
 * MapPanel - center column. Shows either an empty state or the interactive map.
 *
 * Implementation note: we use CircleMarker instead of Marker on purpose.
 * Leaflet's default Marker requires loading external icon files that break
 * with Vite bundling unless you patch the icon URLs. CircleMarker is just
 * a colored circle - no asset issues, and it looks cleaner anyway.
 */

// Color per point category. Keep in sync with the type-{name} CSS classes.
const TYPE_COLORS = {
  match: '#f97316',           // orange - the headline event
  restaurant: '#facc15',      // yellow
  hotel: '#3b82f6',           // blue
  activity: '#10b981',        // green
  community_event: '#a855f7', // purple
  route: '#94a3b8'            // gray
}

const TYPE_LABELS = {
  match: 'Match',
  restaurant: 'Restaurant',
  hotel: 'Hôtel',
  activity: 'Activité',
  community_event: 'Événement',
  route: 'Trajet'
}

function MapPanel({ mapData, currentDay, onPointClick, onDayChange }) {
  // EMPTY STATE: shown before the AI has gathered enough info to produce a map.
  // This is what the judges see at the start of the demo, so make it look intentional.
  if (!mapData) {
    return (
      <section className="map-panel">
        <div className="map-empty">
          <div className="map-empty-icon">🗺️</div>
          <h2>Your map will appear here</h2>
          <p>Start chatting with the agent on the left to generate your personalized map.</p>
        </div>
      </section>
    )
  }

  // Find the points for the day currently selected by the user.
  // Defensive ?. and || [] so we don't crash if the data shape is off.
  const currentDayData = mapData.days.find(d => d.day === currentDay)
  const points = currentDayData?.points || []

  // Center on the day's match (preferred) so the stadium sits in the middle
  // of the map while hotels/restaurants spread around it.
  const matchPoint = points.find(p => p.type === 'match')
  const dayCenter = matchPoint
    ? [matchPoint.lat, matchPoint.lng]
    : points.length > 0
      ? [points[0].lat, points[0].lng]
      : [mapData.coordinates.lat, mapData.coordinates.lng]

  return (
    <section className="map-panel">
      <div className="map-header">
        <h2>
          {points.find(p => p.type === 'match')?.details?.stadium || mapData.city}
          <span className="day-label"> — Day {currentDay}</span>
        </h2>
        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: TYPE_COLORS.match }}></span>Stadium</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: TYPE_COLORS.hotel }}></span>Hotel</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: TYPE_COLORS.restaurant }}></span>Restaurant</span>
        </div>
      </div>

      {/* Wrapper exists so we can give the map an explicit flex height in CSS */}
      <div className="map-container-wrapper">
        <MapContainer
          // Re-mount whenever the active day changes so the map recenters
          // to that day's stadium instead of staying on Day 1's city.
          key={`${mapData.city}-${currentDay}`}
          center={dayCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          {/* CARTO Voyager tiles - clean, colored, no API key, free */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={20}
          />

          {points.map(point => (
            <CircleMarker
              key={point.id}
              center={[point.lat, point.lng]}
              radius={point.type === 'match' ? 14 : 9}
              pathOptions={{
                fillColor: TYPE_COLORS[point.type] || '#94a3b8',
                fillOpacity: 0.9,
                color: '#ffffff',
                weight: 2
              }}
              eventHandlers={{ click: () => onPointClick(point) }}
            >
              {/* Hover tooltip — shows what the marker is at a glance */}
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <strong>{TYPE_LABELS[point.type]}</strong>: {point.title}
              </Tooltip>
              <Popup>
                <strong>{point.title}</strong><br />
                <small>{TYPE_LABELS[point.type]}</small>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Day navigation - one button per day, active one is highlighted */}
      <div className="day-nav">
        {mapData.days.map(day => (
          <button
            key={day.day}
            className={`day-btn ${day.day === currentDay ? 'active' : ''}`}
            onClick={() => onDayChange(day.day)}
          >
            Day {day.day}
          </button>
        ))}
      </div>
    </section>
  )
}

export default MapPanel