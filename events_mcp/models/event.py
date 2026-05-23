from dataclasses import dataclass, asdict
from typing import List, Optional
from datetime import datetime
from enum import Enum


class EventSource(str, Enum):
    EVENTBRITE = "eventbrite"
    LUMA = "luma"
    TICKETMASTER = "ticketmaster"
    VENUE = "venue"
    OFFICIAL = "official"


class EventType(str, Enum):
    MATCH = "match"
    WATCH_PARTY = "watch_party"
    COMMUNITY_GATHERING = "community_gathering"
    BAR_RESTAURANT = "bar_restaurant"


@dataclass
class Location:
    name: str
    address: str
    city: str
    state: str
    country: str
    latitude: float
    longitude: float

    def to_dict(self):
        return asdict(self)


@dataclass
class NormalizedEvent:
    id: str
    source: EventSource
    event_type: EventType
    title: str
    description: str
    date_time: datetime
    duration_minutes: int
    location: Location
    capacity: Optional[int]
    rsvp_count: Optional[int]
    price: Optional[float]
    currency: str = "USD"
    vibe_tags: List[str] = None
    related_teams: List[str] = None
    url: str = None
    distance_from_hotel_miles: Optional[float] = None
    feasibility_score: Optional[float] = None

    def to_dict(self):
        data = asdict(self)
        data["date_time"] = self.date_time.isoformat()
        data["source"] = self.source.value
        data["event_type"] = self.event_type.value
        return data
