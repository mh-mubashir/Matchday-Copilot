/**
 * Mock backend that simulates the real POST /api/chat endpoint.
 *
 * The conversation follows a scripted flow: each user message advances to
 * the next question, and after the 4th user message the AI returns the map.
 *
 * Once the backend URL is known, replace mockSendMessage with a real fetch():
 *
 *   export const mockSendMessage = async ({ messages, message }) => {
 *     const res = await fetch('http://BACKEND_URL/api/chat', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ messages, message })
 *     })
 *     return res.json()
 *   }
 */

// Counts how many messages the user has sent so far in the conversation.
const countUserMessages = (messages) => messages.filter(m => m.role === 'user').length

// Sample map payload returned when the AI has all 4 criteria.
// Coordinates are real LA locations so the map looks credible in the demo.
const SAMPLE_MAP_DATA = {
  city: 'Los Angeles',
  coordinates: { lat: 34.0522, lng: -118.2437 },
  days: [
    {
      day: 1,
      points: [
        {
          id: 'h1',
          type: 'hotel',
          title: 'The Hoxton DTLA',
          lat: 34.0479,
          lng: -118.2563,
          details: {
            address: '1060 S Broadway, Los Angeles',
            budget: '$220/nuit',
            travelTime: '15 min en Uber depuis LAX',
            mapsUrl: 'https://maps.google.com/?q=The+Hoxton+DTLA'
          }
        },
        {
          id: 'r1',
          type: 'restaurant',
          title: 'Grand Central Market',
          lat: 34.0506,
          lng: -118.2487,
          details: {
            address: '317 S Broadway',
            cuisine: 'Marché de street food',
            schedule: '8h-22h',
            budget: '$15-25'
          }
        },
        {
          id: 's1',
          type: 'match',
          title: 'France vs Brésil',
          lat: 33.9534,
          lng: -118.3387,
          details: {
            stadium: 'SoFi Stadium',
            time: '18:00',
            teams: 'France 🇫🇷 vs Brésil 🇧🇷',
            ticketsUrl: 'https://fifa.com/tickets'
          }
        },
        {
          id: 'a1',
          type: 'activity',
          title: 'Griffith Observatory',
          lat: 34.1184,
          lng: -118.3004,
          details: {
            address: '2800 E Observatory Rd',
            type: 'Point de vue panoramique',
            schedule: '12h-22h',
            budget: 'Gratuit'
          }
        }
      ]
    },
    {
      day: 2,
      points: [
        {
          id: 'c1',
          type: 'community_event',
          title: 'Fan Zone Brésilienne',
          lat: 34.0407,
          lng: -118.2468,
          details: {
            location: 'Pershing Square',
            time: '14:00',
            attendance: 'Forte (3000+ attendus)',
            bookingUrl: 'https://example.com/booking'
          }
        },
        {
          id: 'r2',
          type: 'restaurant',
          title: 'Guelaguetza',
          lat: 34.0617,
          lng: -118.3034,
          details: {
            address: '3014 W Olympic Blvd',
            cuisine: 'Mexicain (Oaxaca)',
            schedule: '10h-22h',
            budget: '$25-40'
          }
        },
        {
          id: 'rt1',
          type: 'route',
          title: 'Hôtel → Fan Zone',
          lat: 34.044,
          lng: -118.252,
          details: {
            travelTime: '12 min en voiture',
            traffic: 'Fluide',
            mapsUrl: 'https://maps.google.com'
          }
        }
      ]
    }
  ]
}

export const mockSendMessage = ({ messages, message }) => {
  // Returns a Promise that resolves after 800ms to mimic real network latency.
  // This lets us test the loading state properly during development.
  return new Promise((resolve) => {
    setTimeout(() => {
      const userMessageCount = countUserMessages(messages)

      // Scripted conversation flow - one question per user message.
      if (userMessageCount === 1) {
        resolve({ type: 'message', content: 'Great! Which team are you here to cheer on?' })
      } else if (userMessageCount === 2) {
        resolve({ type: 'message', content: 'Great choice! How many days are you staying there?' })
      } else if (userMessageCount === 3) {
        resolve({ type: 'message', content: 'Perfect. And what’s your total budget for the trip (in USD)?' })
      } else {
        // All 4 criteria collected - return the map payload.
        resolve({
          type: 'map_ready',
          content: `Here's your map for ${SAMPLE_MAP_DATA.city}! Click on the markers to explore each stop.`,
          ...SAMPLE_MAP_DATA
        })
      }
    }, 800)
  })
}