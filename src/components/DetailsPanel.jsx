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
      case 'match':
        return (
          <>
            <Field label="Stadium" value={details.stadium} />
            <Field label="Hour" value={details.time} />
            <Field label="Teams" value={details.teams} />
            <ActionLink href={details.ticketsUrl} label="Buy Tickets" />
          </>
        )

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
      case 'activity':
        // These two share the same layout - cuisine vs type is the only diff.
        return (
          <>
            <Field label="Address" value={details.address} />
            <Field
              label={type === 'restaurant' ? 'Cuisine' : 'Type'}
              value={details.cuisine || details.type}
            />
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
            <Field label="Address" value={details.address} />
            <Field label="Budget" value={details.budget} />
            <Field label="Travel Time" value={details.travelTime} />
            <ActionLink
              href={details.mapsUrl || 'https://maps.google.com'}
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