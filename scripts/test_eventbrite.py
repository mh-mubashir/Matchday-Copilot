#!/usr/bin/env python3
"""Simple test script to validate EVENTBRITE_API_TOKEN by searching for events.

Uses the Eventbrite API v3: GET /events/search/

Usage:
  python scripts/test_eventbrite.py --location "Toronto, ON" --date "2025-12-25" --keywords "World Cup"

The script attempts to load `.env` then falls back to `.env.example` if the key is missing.
"""
import os
import sys
import argparse
import json
import requests
from datetime import datetime, timedelta

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=".env")
    if not os.getenv("EVENTBRITE_API_TOKEN"):
        load_dotenv(dotenv_path=".env.example")
except ModuleNotFoundError:
    pass

API_TOKEN = os.getenv("EVENTBRITE_API_TOKEN")

if not API_TOKEN:
    print("ERROR: EVENTBRITE_API_TOKEN not found in .env or .env.example")
    sys.exit(2)

parser = argparse.ArgumentParser(description="Test Eventbrite API Key via Event Search")
parser.add_argument("--location", "-l", default="Toronto, ON", help="Location to search (e.g. 'Toronto, ON')")
parser.add_argument("--date", "-d", help="Date to search (YYYY-MM-DD). Defaults to today.")
parser.add_argument("--keywords", "-k", default="World Cup", help="Keywords to search (e.g. 'World Cup')")
parser.add_argument("--limit", "-n", type=int, default=5, help="Number of results to display")
args = parser.parse_args()

if not args.date:
    args.date = datetime.now().strftime("%Y-%m-%d")

base_url = "https://www.eventbriteapi.com/v3"
headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}
params = {
    "q": args.keywords,
    "location.address": args.location,
    "start_date.range_start": f"{args.date}T00:00:00",
    "start_date.range_end": f"{args.date}T23:59:59",
    "expand": "venue",
    "page_size": args.limit
}

try:
    resp = requests.get(f"{base_url}/events/search/", headers=headers, params=params, timeout=10)
    data = resp.json()
except Exception as e:
    print("Request failed:", e)
    sys.exit(3)

if not resp.ok:
    print(f"HTTP {resp.status_code}")
    print("Full response:")
    print(json.dumps(data, indent=2))
    sys.exit(1)

events = data.get("events", [])
print(f"Found {len(events)} event(s). Showing first {min(args.limit, len(events))}:")
for i, e in enumerate(events[:args.limit], start=1):
    name = e.get("name", {}).get("text") if isinstance(e.get("name"), dict) else e.get("name", "")
    venue = e.get("venue", {}) or {}
    venue_name = venue.get("name", "N/A")
    event_id = e.get("id")
    start_time = e.get("start", {}).get("utc", "N/A")
    print(f"{i}. {name} — {venue_name} (starts: {start_time}, id={event_id})")

if events:
    print("\nFirst result (compact JSON):")
    e = events[0]
    venue = e.get("venue", {}) or {}
    print(json.dumps({
        "name": e.get("name", {}).get("text") if isinstance(e.get("name"), dict) else e.get("name", ""),
        "venue": venue.get("name"),
        "start_time": e.get("start", {}).get("utc"),
        "event_id": e.get("id"),
        "url": e.get("url"),
    }, indent=2))

print("\nDone.")
