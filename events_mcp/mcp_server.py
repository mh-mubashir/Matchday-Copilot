import os
import json
import argparse

from mcp.server.fastmcp import FastMCP

from events_mcp.integrations.ticketmaster import TicketmasterIntegration
from events_mcp.integrations.google_places import GooglePlacesIntegration

from dotenv import load_dotenv
load_dotenv(dotenv_path=".env.example")

ticketmaster = TicketmasterIntegration()
places = GooglePlacesIntegration()

mcp = FastMCP("events-mcp")


@mcp.tool()
def search_events(location: str, date: str, keywords: str = "World Cup") -> str:
    """Search Ticketmaster for events at a location on a given date.

    Args:
        location: City and state, e.g. "San Francisco, CA"
        date: Date in YYYY-MM-DD format
        keywords: Search keywords, e.g. "World Cup watch party"
    """
    events = ticketmaster.search_watch_parties(location, date, keywords)
    return json.dumps([e.to_dict() for e in events], indent=2, default=str)


@mcp.tool()
def get_event_details(event_id: str) -> str:
    """Get full details for a specific Ticketmaster event by its ID.

    Args:
        event_id: Ticketmaster event ID (without the 'ticketmaster_' prefix)
    """
    event = ticketmaster.get_event_details(event_id)
    if event is None:
        return json.dumps({"error": f"Event {event_id} not found"})
    return json.dumps(event.to_dict(), indent=2, default=str)


@mcp.tool()
def find_venues(location: str, query: str = "sports bar World Cup") -> str:
    """Find venues near a location using Google Places (bars, restaurants, etc.).

    Args:
        location: City and state, e.g. "San Francisco, CA"
        query: Type of venue to search for, e.g. "sports bar" or "restaurant with big screen"
    """
    venues = places.find_venues(location, query)
    return json.dumps(venues, indent=2, default=str)


@mcp.tool()
def get_venue_details(place_id: str) -> str:
    """Get full details for a Google Places venue by place ID.

    Args:
        place_id: Google Places place_id string
    """
    venue = places.get_place_details(place_id)
    if venue is None:
        return json.dumps({"error": f"Place {place_id} not found"})
    return json.dumps(venue, indent=2, default=str)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Events MCP Server")
    parser.add_argument(
        "--transport",
        choices=["stdio", "streamable-http"],
        default=os.getenv("MCP_TRANSPORT", "stdio"),
        help="Transport mode (default: stdio)",
    )
    parser.add_argument(
        "--host",
        default=os.getenv("MCP_HOST", "0.0.0.0"),
        help="Host for streamable-http (default: 0.0.0.0)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("MCP_SERVER_PORT", "8000")),
        help="Port for streamable-http (default: 8000)",
    )
    args = parser.parse_args()

    if args.transport == "streamable-http":
        mcp.settings.host = args.host
        mcp.settings.port = args.port
        mcp.run(transport="streamable-http")
    else:
        mcp.run(transport="stdio")
