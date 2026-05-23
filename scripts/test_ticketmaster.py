#!/usr/bin/env python3
"""Validate TICKETMASTER_API_KEY by searching for events.

Uses the Ticketmaster Discovery API v2: GET /discovery/v2/events.json

Usage:
  python scripts/test_ticketmaster.py --location "San Francisco, CA" --date "2025-06-15"
"""
import os
import sys
import argparse
import json
import requests
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=".env")
    if not os.getenv("TICKETMASTER_API_KEY"):
        load_dotenv(dotenv_path=".env.example")
except ModuleNotFoundError:
    pass

API_KEY = os.getenv("TICKETMASTER_API_KEY")

if not API_KEY:
    print("ERROR: TICKETMASTER_API_KEY not found in .env or .env.example")
    sys.exit(2)

parser = argparse.ArgumentParser(description="Test Ticketmaster API Key via Event Search")
parser.add_argument("--location", "-l", default="San Francisco, CA", help="City to search (e.g. 'San Francisco')")
parser.add_argument("--date", "-d", help="Date to search (YYYY-MM-DD). Defaults to today.")
parser.add_argument("--keywords", "-k", default="World Cup watch party", help="Keywords to search")
parser.add_argument("--limit", "-n", type=int, default=5, help="Number of results to display")
args = parser.parse_args()

if not args.date:
    args.date = datetime.now().strftime("%Y-%m-%d")

city = args.location.split(",")[0].strip()

params = {
    "apikey": API_KEY,
    "keyword": args.keywords,
    "city": city,
    "startDateTime": f"{args.date}T00:00:00Z",
    "endDateTime": f"{args.date}T23:59:59Z",
    "size": args.limit,
}

try:
    resp = requests.get(
        "https://app.ticketmaster.com/discovery/v2/events.json",
        params=params,
        timeout=10,
    )
    data = resp.json()
except Exception as e:
    print("Request failed:", e)
    sys.exit(3)

if not resp.ok:
    print(f"HTTP {resp.status_code}")
    print(json.dumps(data, indent=2))
    sys.exit(1)

events = (data.get("_embedded") or {}).get("events", [])
print(f"Found {data.get('page', {}).get('totalElements', 0)} total event(s). Showing first {len(events)}:")

for i, e in enumerate(events[:args.limit], start=1):
    venues = (e.get("_embedded") or {}).get("venues", [{}])
    venue_name = venues[0].get("name", "N/A") if venues else "N/A"
    start_time = (e.get("dates", {}).get("start") or {}).get("dateTime", "N/A")
    print(f"{i}. {e.get('name')} — {venue_name} (starts: {start_time}, id={e.get('id')})")

if events:
    e = events[0]
    venues = (e.get("_embedded") or {}).get("venues", [{}])
    venue = venues[0] if venues else {}
    print("\nFirst result (compact JSON):")
    print(json.dumps({
        "name": e.get("name"),
        "venue": venue.get("name"),
        "city": (venue.get("city") or {}).get("name"),
        "start_time": (e.get("dates", {}).get("start") or {}).get("dateTime"),
        "event_id": e.get("id"),
        "url": e.get("url"),
    }, indent=2))

print("\nDone.")
