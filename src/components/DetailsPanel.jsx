import { lookupStadium } from '../stadiumInfo'

/**
 * DetailsPanel - right column. Shows details about the point selected on the map.
 *
 * The panel is fully driven by the `selectedPoint` prop:
 *   - if null, the component returns null (no DOM rendered at all)
 *   - if set, it renders different fields depending on point.type
 *
 * Five point types are supported: match, community_event, restaurant,
 * activity, route, hotel. Each has its own field layout in renderContent().
 */
function DetailsPanel({ selectedPoint, onClose }) {
  // Hidden state: nothing in the DOM = no width taken, layout collapses.
  if (!selectedPoint) return null

  const { type, title, details } = selectedPoint

  // One render branch per point type. A switch is fine here since we have
  // only 6 cases - splitting into sub-components would be over-engineering.
  const renderContent = () => {
    switch (type) {
      case 'match': {
        const info = lookupStadium(details.stadium)
        return (
          <>
            <div className="match-hero">
              <div className="match-stadium-name">{info?.name || details.stadium}</div>
              <div className="match-meta-row">
                <div className="match-meta">
                  <span className="match-meta-label">Date</span>
                  <span className="match-meta-value">{details.date || '—'}</span>
                </div>
                <div className="match-meta">
                  <span className="match-meta-label">Kickoff</span>
                  <span className="match-meta-value">{details.time || 'TBD'}</span>
                </div>
                {details.matchNumber && (
                  <div className="match-meta">
                    <span className="match-meta-label">Match</span>
                    <span className="match-meta-value">{details.matchNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {info && (
              <>
                <div className="stat-grid">
                  <div className="stat-tile">
                    <div className="stat-tile-icon">👥</div>
                    <div>
                      <div className="stat-tile-value">{info.capacity}</div>
                      <div className="stat-tile-label">Capacity</div>
                    </div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile-icon">🏗️</div>
                    <div>
                      <div className="stat-tile-value">{info.opened}</div>
                      <div className="stat-tile-label">Opened</div>
                    </div>
                  </div>
                </div>

                <InfoCard icon="🏆" title="History">{info.history}</InfoCard>
                <InfoCard icon="📍" title="Around the stadium">{info.surroundings}</InfoCard>
                <InfoCard icon="🚇" title="Traffic & getting there">{info.traffic}</InfoCard>

                {info.nearby?.length > 0 && (
                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-card-icon">✨</span>
                      <h3 className="info-card-title">Nearby</h3>
                    </div>
                    <ul className="info-card-list">
                      {info.nearby.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </div>
                )}
              </>
            )}
            <ActionLink
              href={`https://maps.google.com/?q=${encodeURIComponent(info?.name || details.stadium || title)}`}
              label="Open in Google Maps"
            />
            <ActionLink href={details.ticketsUrl} label="Buy Tickets" />
          </>
        )
      }

      case 'community_event':
        return (
          <>
            <Field label="Location" value={details.location} />
            <Field label="Hour" value={details.time} />
            <Field label="Attendance" value={details.attendance} />
            <ActionLink href={details.bookingUrl} label="Book" />
          </>
        )

      case 'restaurant':
        return (
          <>
            <div className="match-hero">
              <div className="match-stadium-name">{title}</div>
              <div className="match-meta-row">
                <div className="match-meta">
                  <span className="match-meta-label">Cuisine</span>
                  <span className="match-meta-value">{details.cuisine || '—'}</span>
                </div>
                <div className="match-meta">
                  <span className="match-meta-label">Price</span>
                  <span className="match-meta-value">{details.priceRange || details.budget || '—'}</span>
                </div>
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat-tile">
                <div className="stat-tile-icon">⏰</div>
                <div>
                  <div className="stat-tile-value" style={{ fontSize: 13 }}>{details.hours || details.schedule || '—'}</div>
                  <div className="stat-tile-label">Hours</div>
                </div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-icon">📍</div>
                <div>
                  <div className="stat-tile-value" style={{ fontSize: 13 }}>{details.address || '—'}</div>
                  <div className="stat-tile-label">Address</div>
                </div>
              </div>
            </div>
            {details.signature && (
              <InfoCard icon="⭐" title="What to order">{details.signature}</InfoCard>
            )}
            <ActionLink
              href={`https://maps.google.com/?q=${encodeURIComponent(details.address || title)}`}
              label="Open in Google Maps"
            />
          </>
        )

      case 'activity':
        return (
          <>
            <Field label="Address" value={details.address} />
            <Field label="Type" value={details.type} />
            <Field label="Hours" value={details.schedule} />
            <Field label="Budget" value={details.budget} />
          </>
        )

      case 'road':
        return (
          <>
            <Field label="Travel Time" value={details.travelTime} />
            <Field label="Traffic" value={details.traffic} />
            <ActionLink href={details.mapsUrl} label="Open in Google Maps" />
          </>
        )

      case 'hotel':
        return (
          <>
            <div className="match-hero">
              <div className="match-stadium-name">{title}</div>
              <div className="match-meta-row">
                <div className="match-meta">
                  <span className="match-meta-label">Price</span>
                  <span className="match-meta-value">{details.pricePerNight || details.budget || '—'}</span>
                </div>
                <div className="match-meta">
                  <span className="match-meta-label">To stadium</span>
                  <span className="match-meta-value">{details.walkDistance || details.travelTime || '—'}</span>
                </div>
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat-tile">
                <div className="stat-tile-icon">📍</div>
                <div>
                  <div className="stat-tile-value" style={{ fontSize: 13 }}>{details.address || '—'}</div>
                  <div className="stat-tile-label">Address</div>
                </div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-icon">🛎️</div>
                <div>
                  <div className="stat-tile-value" style={{ fontSize: 13 }}>{details.amenities || '—'}</div>
                  <div className="stat-tile-label">Amenities</div>
                </div>
              </div>
            </div>
            {details.description && (
              <InfoCard icon="ℹ️" title="About this hotel">{details.description}</InfoCard>
            )}
            <ActionLink
              href={details.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(details.address || title)}`}
              label="Open in Google Maps"
            />
          </>
        )

      default:
        return <p>Details not available</p>
    }
  }

  return (
    <aside className="details-panel">
      <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>

      {/* Colored badge identifies the point type at a glance */}
      <span className={`type-badge type-${type}`}>
        {type.replace('_', ' ')}
      </span>

      <h2 className="details-title">{title}</h2>

      <div className="details-content">
        {renderContent()}
      </div>
    </aside>
  )
}

/**
 * Small subcomponent for label/value pairs.
 * Returns null if value is missing so we don't render empty fields.
 */
function Field({ label, value }) {
  if (!value) return null
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <span className="field-value">{value}</span>
    </div>
  )
}

/**
 * Card-style section with icon + title + paragraph body.
 */
function InfoCard({ icon, title, children }) {
  return (
    <div className="info-card">
      <div className="info-card-header">
        <span className="info-card-icon">{icon}</span>
        <h3 className="info-card-title">{title}</h3>
      </div>
      <p className="info-card-text">{children}</p>
    </div>
  )
}

/**
 * Reusable CTA link - tickets, Maps, bookings, etc.
 * Always opens in a new tab for safety (rel="noopener" prevents tab-jacking).
 */
function ActionLink({ href, label }) {
  if (!href) return null
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="action-link">
      {label} →
    </a>
  )
}

export default DetailsPanel