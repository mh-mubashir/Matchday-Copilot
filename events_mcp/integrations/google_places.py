import os
import requests
from typing import List, Optional


class GooglePlacesIntegration:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_PLACES_API_KEY")
        self.base_url = "https://maps.googleapis.com/maps/api/place"

    def find_venues(self, location: str, query: str = "sports bar", radius_meters: int = 10000) -> List[dict]:
        try:
            params = {
                "query": f"{query} near {location}",
                "key": self.api_key,
            }
            resp = requests.get(f"{self.base_url}/textsearch/json", params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", [])
            return [self._normalize(r) for r in results]
        except Exception as e:
            print("Google Places search error:", e)
            return []

    def get_place_details(self, place_id: str) -> Optional[dict]:
        try:
            params = {
                "place_id": place_id,
                "fields": "name,formatted_address,formatted_phone_number,opening_hours,website,rating,geometry",
                "key": self.api_key,
            }
            resp = requests.get(f"{self.base_url}/details/json", params=params, timeout=10)
            resp.raise_for_status()
            return self._normalize(resp.json().get("result", {}))
        except Exception as e:
            print("Google Places detail error:", e)
            return None

    def _normalize(self, place: dict) -> dict:
        geo = place.get("geometry", {}).get("location", {})
        return {
            "place_id": place.get("place_id"),
            "name": place.get("name"),
            "address": place.get("formatted_address") or place.get("vicinity"),
            "phone": place.get("formatted_phone_number"),
            "website": place.get("website"),
            "rating": place.get("rating"),
            "open_now": (place.get("opening_hours") or {}).get("open_now"),
            "hours": (place.get("opening_hours") or {}).get("weekday_text"),
            "latitude": geo.get("lat"),
            "longitude": geo.get("lng"),
            "google_maps_url": f"https://www.google.com/maps/place/?q=place_id:{place.get('place_id')}" if place.get("place_id") else None,
        }
