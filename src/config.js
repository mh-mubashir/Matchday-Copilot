/**
 * Fetches public client config (Google Maps key) from the backend exactly
 * once and caches the promise so multiple components share the result.
 */
let configPromise = null

export function getConfig() {
  if (!configPromise) {
    configPromise = fetch('/api/config')
      .then(r => r.ok ? r.json() : { googleMapsKey: '' })
      .catch(() => ({ googleMapsKey: '' }))
  }
  return configPromise
}

/**
 * Fetch the lead image URL for a Wikipedia article title.
 * Returns null if the article has no image or the request fails.
 */
export async function fetchWikipediaImage(title) {
  if (!title) return null
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${title}&origin=*`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const pages = data?.query?.pages || {}
    const first = Object.values(pages)[0]
    return first?.original?.source || null
  } catch {
    return null
  }
}
