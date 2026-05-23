import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// CRITICAL: Leaflet ships its own CSS that positions tiles and markers correctly.
// If you forget this import, the map renders as a broken patchwork. Don't skip.
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)