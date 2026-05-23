#!/usr/bin/env python3
"""Simple test script to validate GOOGLE_PLACES_API_KEY by doing a Text Search.

Uses the Places API (New): POST /v1/places:searchText

Usage:
  python scripts/test_google_places.py --query "pizza in Toronto"

The script attempts to load `.env` then falls back to `.env.example` if the key is missing.
"""
import os
import sys
import argparse
import json
import requests

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=".env")
    if not os.getenv("GOOGLE_PLACES_API_KEY"):
        load_dotenv(dotenv_path=".env.example")
except ModuleNotFoundError:
    pass

API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

if not API_KEY:
    print("ERROR: GOOGLE_PLACES_API_KEY not found in .env or .env.example")
    sys.exit(2)

parser = argparse.ArgumentParser(description="Test Google Places API (New) Key via Text Search")
parser.add_argument("--query", "-q", default="coffee near me", help="Text query to search (e.g. 'pizza in Toronto')")
parser.add_argument("--limit", "-n", type=int, default=3, help="Number of results to display")
args = parser.parse_args()

url = "https://places.googleapis.com/v1/places:searchText"
headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id,places.types",
}
body = {
    "textQuery": args.query,
    "pageSize": args.limit,
}

try:
    resp = requests.post(url, headers=headers, json=body, timeout=10)
    data = resp.json()
except Exception as e:
    print("Request failed:", e)
    sys.exit(3)

if not resp.ok:
    print(f"HTTP {resp.status_code}")
    print("Full response:")
    print(json.dumps(data, indent=2))
    sys.exit(1)

places = data.get("places", [])
print(f"Found {len(places)} result(s). Showing first {min(args.limit, len(places))}:")
for i, p in enumerate(places[:args.limit], start=1):
    name = p.get("displayName", {}).get("text")
    addr = p.get("formattedAddress")
    place_id = p.get("id")
    types = p.get("types")
    print(f"{i}. {name} — {addr} (types={types})")

if places:
    print("\nFirst result (compact JSON):")
    p = places[0]
    print(json.dumps({
        "name": p.get("displayName", {}).get("text"),
        "address": p.get("formattedAddress"),
        "place_id": p.get("id"),
        "types": p.get("types"),
    }, indent=2))

print("\nDone.")
