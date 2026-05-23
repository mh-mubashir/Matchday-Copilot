import json
import os
import re
import sys
from contextlib import asynccontextmanager
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel

from gmi_chat import load_docs, MODEL, BASE_URL

state: dict = {}


SYSTEM_INSTRUCTIONS = """You are MatchDay Copilot, an assistant for travelers attending the 2026 FIFA World Cup.

You ALWAYS respond with a single JSON object wrapped in a ```json fenced block. The object has exactly two top-level fields:

- `message` (string, required): markdown text shown in the chat window. This is what the user reads.
- `map` (object or null, required): structured itinerary that drives the right-hand map. Null when you have no map update to make (e.g., still gathering info, or just answering a question).

Schema:
```json
{
  "message": "<markdown text for the chat>",
  "map": null
}
```
OR when you have enough info to produce an itinerary:
```json
{
  "message": "<short markdown summary for the chat>",
  "map": {
    "city": "<city to center the map on>",
    "coordinates": { "lat": <number>, "lng": <number> },
    "days": [
      {
        "day": 1,
        "points": [
          {
            "id": "<unique short id>",
            "type": "match",
            "title": "<Team A vs Team B>",
            "lat": <number>,
            "lng": <number>,
            "details": {
              "stadium": "<stadium name>",
              "time": "<kickoff time if known, else 'TBD'>",
              "date": "<YYYY-MM-DD>",
              "matchNumber": "<#N from schedule>"
            }
          }
        ]
      }
    ]
  }
}
```

ITINERARY RULES:
- Use ONLY the matches and stadium coordinates from the DOCUMENTS below. Do not invent matches or coordinates.
- You MUST scan the ENTIRE schedule (Part 2) and include EVERY match where the user's team appears AND the date falls within their date range (inclusive). Do not stop at the first match. Do not omit later ones.
- Each match goes on its own day entry. ONLY include days that have at least one match — skip dates with no relevant matches entirely. Renumber `day` as 1, 2, 3... from the earliest match date to the latest. Do NOT include empty-points days.
- The `message` field must list every match found, one bullet per match, including date, opponent, stadium name, and city. Be explicit about how many matches you found.
- `coordinates` (top-level) = the lat/lng of day 1's first match.
- `lat` is positive for N, negative for S. `lng` is NEGATIVE for W (all US/Canada/Mexico stadiums in the docs are W).
- Each match must have a unique `id` like "m1", "m2".
- If no matches in the user's date range involve their team, set `map: null` and explain in `message` that you found no matches, listing the nearest dates outside their window.

CONVERSATION RULES:
- If you don't yet have team + date range + number of days, set `map` to null and ask one follow-up question in `message`.
- Once you have everything, return both a `message` (a friendly summary) AND a populated `map`.
- For follow-up questions about an already-shown plan (e.g., "tell me more about match 2"), return `message` with the answer and `map: null` (don't re-emit unchanged map data).
- Be concise and friendly. Use markdown sparingly in `message`.
- Never output anything outside the ```json fenced block.

--- DOCUMENTS ---
{docs}
--- END DOCUMENTS ---
"""


def extract_json(text: str) -> dict[str, Any] | None:
    """Pull the first JSON object out of the model's response."""
    fence = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    candidate = fence.group(1) if fence else None
    if candidate is None:
        brace = re.search(r"\{.*\}", text, re.DOTALL)
        candidate = brace.group(0) if brace else None
    if candidate is None:
        return None
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv()
    api_key = os.getenv("GMI_API_KEY")
    if not api_key:
        print("ERROR: GMI_API_KEY not set in .env")
        sys.exit(1)

    print("Loading documents...")
    context = load_docs()
    if not context:
        print("WARNING: no documents loaded.")
    print(f"Total context: {len(context):,} chars")
    print(f"Model: {MODEL}")

    state["client"] = OpenAI(api_key=api_key, base_url=BASE_URL)
    state["system_prompt"] = SYSTEM_INSTRUCTIONS.replace("{docs}", context)
    yield


app = FastAPI(lifespan=lifespan)


class Message(BaseModel):
    role: str
    content: str


class ChatIn(BaseModel):
    messages: list[Message]
    message: str | None = None
    mapContext: dict[str, Any] | None = None


def summarize_map_context(ctx: dict[str, Any] | None) -> str:
    """Render the current map state as plain text the LLM can reason about."""
    if not ctx or not ctx.get("days"):
        return ""
    lines = ["CURRENT MAP ON SCREEN:"]
    for day in ctx["days"]:
        lines.append(f"  Day {day['day']}:")
        for p in day.get("points", []):
            d = p.get("details", {})
            if p.get("type") == "match":
                lines.append(f"    - MATCH: {p['title']} at {d.get('stadium','')} on {d.get('date','')} {d.get('time','')}")
            elif p.get("type") == "hotel":
                lines.append(f"    - HOTEL: {p['title']} ({d.get('pricePerNight','')}, {d.get('walkDistance','')})")
            elif p.get("type") == "restaurant":
                lines.append(f"    - RESTAURANT: {p['title']} ({d.get('cuisine','')}, hours {d.get('hours','')}, signature: {d.get('signature','')})")
    return "\n".join(lines)


@app.post("/api/chat")
async def chat(body: ChatIn) -> dict[str, Any]:
    if not body.messages:
        raise HTTPException(status_code=400, detail="empty messages")

    system_content = state["system_prompt"]
    ctx_summary = summarize_map_context(body.mapContext)
    if ctx_summary:
        system_content += (
            "\n\n--- ON-SCREEN CONTEXT (current itinerary the user can see) ---\n"
            + ctx_summary
            + "\n--- END ON-SCREEN CONTEXT ---\n"
            "When the user asks about a specific hotel, restaurant, or stadium "
            "shown above, answer from this context. If they ask a follow-up that "
            "does NOT require regenerating the itinerary, return `map: null` and "
            "answer in `message`."
        )

    history = [{"role": "system", "content": system_content}]
    for m in body.messages:
        role = "assistant" if m.role == "ai" else m.role
        history.append({"role": role, "content": m.content})

    try:
        resp = state["client"].chat.completions.create(model=MODEL, messages=history)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"GMI error: {e}")

    raw = resp.choices[0].message.content or ""
    parsed = extract_json(raw)

    if parsed and "message" in parsed:
        return {"message": parsed["message"], "map": parsed.get("map")}

    # Fallback: model didn't return JSON — surface its text as a chat message.
    return {"message": raw or "(empty response)", "map": None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)
