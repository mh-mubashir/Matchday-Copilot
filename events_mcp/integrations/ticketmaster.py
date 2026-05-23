import os
import requests
from typing import List, Optional
from datetime import datetime

from events_mcp.models.event import NormalizedEvent, EventSource, EventType, Location


class TicketmasterIntegration:
    def __init__(self):
        self.api_key = os.getenv("TICKETMASTER_API_KEY")
        self.base_url = "https://app.ticketmaster.com/discovery/v2"

    def search_watch_parties(self, location: str, date: str, keywords: str = "World Cup watch party") -> List[NormalizedEvent]:
        try:
            params = {
                "apikey": self.api_key,
                "keyword": keywords,
                "city": location.split(",")[0].strip(),
                "startDateTime": f"{date}T00:00:00Z",
                "endDateTime": f"{date}T23:59:59Z",
                "size": 50,
            }
            resp = requests.get(f"{self.base_url}/events.json", params=params, timeout=10)
            resp.raise_for_status()
            embedded = resp.json().get("_embedded", {})
            events = embedded.get("events", [])
            return [n for e in events for n in [self._normalize(e)] if n is not None]
        except Exception as e:
            print("Ticketmaster search error:", e)
            return []

    def get_event_details(self, event_id: str) -> Optional[NormalizedEvent]:
        try:
            params = {"apikey": self.api_key}
            resp = requests.get(f"{self.base_url}/events/{event_id}.json", params=params, timeout=10)
            resp.raise_for_status()
            return self._normalize(resp.json())
        except Exception as e:
            print("Ticketmaster detail error:", e)
            return None

    def _normalize(self, evt: dict) -> Optional[NormalizedEvent]:
        try:
            venues = (evt.get("_embedded") or {}).get("venues", [])
            venue = venues[0] if venues else {}
            address = (venue.get("address") or {}).get("line1", "")
            city = (venue.get("city") or {}).get("name", "")
            state = (venue.get("state") or {}).get("name", "")
            country = (venue.get("country") or {}).get("countryCode", "")
            loc_data = venue.get("location") or {}
            lat = float(loc_data.get("latitude", 0) or 0)
            lon = float(loc_data.get("longitude", 0) or 0)

            location = Location(
                name=venue.get("name", ""),
                address=address,
                city=city,
                state=state,
                country=country,
                latitude=lat,
                longitude=lon,
            )

            start_str = (evt.get("dates", {}).get("start") or {}).get("dateTime")
            if not start_str:
                return None
            start_dt = datetime.fromisoformat(start_str.replace("Z", "+00:00"))

            price = None
            price_ranges = evt.get("priceRanges")
            if price_ranges:
                price = price_ranges[0].get("min")

            return NormalizedEvent(
                id=f"ticketmaster_{evt.get('id')}",
                source=EventSource.TICKETMASTER,
                event_type=EventType.WATCH_PARTY,
                title=evt.get("name", ""),
                description="",
                date_time=start_dt,
                duration_minutes=120,
                location=location,
                capacity=None,
                rsvp_count=None,
                price=price,
                vibe_tags=["general"],
                related_teams=[],
                url=evt.get("url"),
            )
        except Exception as e:
            print("Normalize Ticketmaster error:", e)
            return None
