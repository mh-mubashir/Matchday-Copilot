import { useState } from 'react'
import ChatPanel from './components/ChatPanel'
import MapPanel from './components/MapPanel'
import DetailsPanel from './components/DetailsPanel'
import { mockSendMessage } from './mockApi'
import { lookupNearby } from './stadiumInfo'

/**
 * After the AI returns a map_ready plan, append 3 hotels + 3 restaurants
 * (from our static lookup) to each day's points so the map renders a richer
 * itinerary than just the stadium pin.
 */
function augmentWithNearby(map) {
  if (!map?.days) return map
  return {
    ...map,
    days: map.days.map(day => {
      const matchPoint = day.points?.find(p => p.type === 'match')
      if (!matchPoint) return day
      const nearby = lookupNearby(matchPoint.details?.stadium)
      if (!nearby) return day
      const dayPrefix = `d${day.day}-`
      return {
        ...day,
        points: [
          ...day.points,
          ...nearby.hotels.map(h => ({ ...h, id: dayPrefix + h.id })),
          ...nearby.restaurants.map(r => ({ ...r, id: dayPrefix + r.id })),
        ],
      }
    }),
  }
}

/**
 * App is the single source of truth for application state.
 * It holds five pieces of state and passes setters down to the three panels.
 * No state library needed - this is just useState + props.
 */
function App() {
  // Chat history. Each message has shape { role: 'user' | 'ai', content: string }.
  // We seed with one AI greeting so the panel isn't empty on first load.
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hi! I'm your MatchDay Copilot. To put together the best plan possible for you, I need a few details. When are you arriving, and in which city will you be for the World Cup?"
    }
  ])

  // True while we wait for an AI response. Disables the send button to prevent spam.
  const [isLoading, setIsLoading] = useState(false)

  // The full map payload returned by the backend on 'map_ready'.
  // null means "no map yet" and triggers the empty state in MapPanel.
  const [mapData, setMapData] = useState(null)

  // Which day is currently shown on the map. Defaults to 1.
  const [currentDay, setCurrentDay] = useState(1)

  // The point clicked on the map. null hides the right panel.
  const [selectedPoint, setSelectedPoint] = useState(null)

  /**
   * Handles a user message: adds it to history, calls the API, processes the response.
   * Wrapped in try/catch so a backend hiccup doesn't break the UI silently.
   */
  const handleSendMessage = async (text) => {
    // Optimistically append the user message so it shows up instantly.
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Send current map context so GMI can answer questions about what's on screen.
      const response = await mockSendMessage({
        messages: newMessages,
        message: text,
        mapContext: mapData,
      })

      // Backend always returns { message, map }. `message` updates the chat;
      // `map` (when non-null) updates the right-hand map panel.
      if (response.message) {
        setMessages([...newMessages, { role: 'ai', content: response.message }])
      }
      if (response.map) {
        const enriched = augmentWithNearby(response.map)
        setMapData({
          city: enriched.city,
          coordinates: enriched.coordinates,
          days: enriched.days,
        })
        setCurrentDay(1)
      }
    } catch (error) {
      console.error('API error:', error)
      setMessages([
        ...newMessages,
        { role: 'ai', content: "Sorry, I'm having a technical issue. Please try again in a moment." }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <ChatPanel
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
      <MapPanel
        mapData={mapData}
        currentDay={currentDay}
        onPointClick={setSelectedPoint}
        onDayChange={setCurrentDay}
      />
      <DetailsPanel
        selectedPoint={selectedPoint}
        onClose={() => setSelectedPoint(null)}
      />
    </div>
  )
}

export default App