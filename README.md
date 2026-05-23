<div align="center">

```
███╗   ███╗ █████╗ ████████╗ ██████╗██╗  ██╗██████╗  █████╗ ██╗   ██╗
████╗ ████║██╔══██╗╚══██╔══╝██╔════╝██║  ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
██╔████╔██║███████║   ██║   ██║     ███████║██║  ██║███████║ ╚████╔╝
██║╚██╔╝██║██╔══██║   ██║   ██║     ██╔══██║██║  ██║██╔══██║  ╚██╔╝
██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╗██║  ██║██████╔╝██║  ██║   ██║
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝
                        C O P I L O T
```

### Your AI travel agent for the 2026 FIFA World Cup ⚽🌎

*Powered by [RocketRide](https://rocketride.ai) orchestrating [GMI Cloud](https://www.gmicloud.ai) inference (Google Gemini)*

</div>

---

## ✨ What it does

Tell MatchDay Copilot which team you're following and when you'll be traveling. It returns a personalized, day-by-day, city-by-city itinerary plotted on an interactive map — every stadium, three nearby hotels, and three restaurants per match day, with the chat window acting as your live tour guide.

```
   You:   "I'm a Germany fan landing June 12, leaving June 27."

   Bot:   Found 3 Germany matches in your window:
            • Jun 14  — Germany vs Curaçao        Houston (NRG)
            • Jun 20  — Germany vs Côte d'Ivoire  Toronto (BMO)
            • Jun 25  — Ecuador vs Germany        East Rutherford (MetLife)

         [map renders 3 day tabs → click any marker for venue details]
```

---

## 🧩 Architecture

MatchDay Copilot runs on a **RocketRide pipeline** as its orchestration backbone. Every chat message flows through RocketRide, which routes inference calls out to **GMI Cloud** (Google Gemini, hosted on GMI's serverless infrastructure) and decorates the results with real-world venue intelligence before returning them to the user.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   ┌──────────┐         ┌──────────────────────┐         ┌──────────┐   │
│   │ Browser  │ ───────▶│      RocketRide      │ ───────▶│   GMI    │   │
│   │  (React) │         │   pipeline runtime   │         │   Cloud  │   │
│   │          │ ◀───────│                      │ ◀───────│ (Gemini) │   │
│   └──────────┘         └──────────────────────┘         └──────────┘   │
│        ▲                          │                                    │
│        │                          ▼                                    │
│        │              ┌──────────────────────┐                         │
│        │              │  Stadium · Hotel ·   │                         │
│        └──────────────│  Restaurant · Maps   │                         │
│         enriched      │   knowledge graph    │                         │
│         payload       └──────────────────────┘                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### The request lifecycle

1. **Browser → RocketRide.** The chat panel posts every user turn to the RocketRide pipeline as a `chat` source event, along with the conversation history and the current on-screen map state.
2. **RocketRide → GMI Cloud.** RocketRide's LLM stage calls **GMI Cloud's inference endpoint**, which serves **Google Gemini** models. GMI handles the heavy lifting — model selection, autoscaling, and prompt caching — so RocketRide can stay focused on orchestration.
3. **Gemini extracts the plan.** GMI returns a structured plan: the user's team, their date window, and the specific matches that satisfy both — pulled from the FIFA 2026 fixture data ingested into the pipeline.
4. **RocketRide enriches.** Once GMI returns the match list, RocketRide's enrichment stage attaches everything else from its knowledge graph:
   - Full stadium dossiers (capacity, history, traffic patterns, nearby attractions)
   - Three hotels per stadium, with prices, walk distances, and amenities
   - Three restaurants per stadium, with cuisine, hours, signature dishes
   - Google Maps deeplinks and embedded map previews for every venue
   - Wikipedia photography for stadiums
5. **RocketRide → Browser.** The enriched payload is split into two channels: a `message` field (markdown text rendered in the chat) and a `map` field (drives the right-hand interactive map and details panel).

### Why this split

- **GMI Cloud handles inference.** Gemini is great at reading natural language, extracting intent ("Germany fan, June 12–27"), and matching it against the schedule. We hand off everything LLM-shaped to GMI.
- **RocketRide handles the world.** Static knowledge — stadium capacities, real coordinates, hotels, traffic notes — doesn't belong in a prompt. RocketRide stores it and joins it onto the inference output, deterministically. The user sees the LLM's reasoning *plus* curated, verifiable detail.

### What the user sees

```
┌─────────────────────┬──────────────────────────┬─────────────────────┐
│                     │                          │                     │
│   CHAT PANEL        │   MAP PANEL              │   DETAILS PANEL     │
│   (GMI text out)    │   (RocketRide markers)   │   (RocketRide data) │
│                     │                          │                     │
│   • markdown        │   • stadium pins         │   • Wikipedia photo │
│   • follow-up Q&A   │   • hotel pins           │   • Google Maps     │
│   • clarifications  │   • restaurant pins      │     embed iframe    │
│   • compares venues │   • day tabs             │   • history, traffic│
│                     │   • hover tooltips       │   • surroundings    │
└─────────────────────┴──────────────────────────┴─────────────────────┘
```

---

## 🚀 Run it locally

### 1 · Configure environment

Copy `env.example` to `.env` and fill in:

```env
# RocketRide pipeline runtime
ROCKETRIDE_URI=http://localhost:54695
ROCKETRIDE_APIKEY=local

# GMI Cloud inference (Gemini)
GMI_API_KEY=your-gmi-cloud-key

# Optional — enables interactive Google Maps embeds on the right panel
GOOGLE_MAPS_KEY=your-google-maps-key
```

### 2 · Start the RocketRide pipeline

```powershell
python api.py
```

This boots the RocketRide orchestration runtime, registers the GMI inference stage, ingests the stadium / match knowledge files in `docs/`, and exposes the pipeline at `http://127.0.0.1:8000`.

### 3 · Start the frontend

```powershell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server proxies `/api/*` straight to the RocketRide runtime.

---

## 🗣️ Try these prompts

A few proven test sequences live in [`demo_prompts.txt`](./demo_prompts.txt). The cleanest cold-start demo:

> **"I'm a Germany fan landing on June 12 and leaving June 27. I want to follow every Germany match."**

Cross-country itinerary across USA → Canada → USA, three stadiums, with the on-screen context immediately available for follow-up Q&A in chat.

---

## 📁 Project layout

```
.
├── api.py                # RocketRide pipeline runtime (FastAPI)
├── gmi_chat.py           # Standalone CLI client for GMI Cloud / Gemini
├── docs/                 # Knowledge base ingested by RocketRide
│   ├── locations.md      #   - 16 venues, fixtures, coordinates
│   └── fifa_wc.md
├── demo_prompts.txt      # Demo script with expected outputs
├── src/                  # React frontend
│   ├── App.jsx           #   state orchestration
│   ├── stadiumInfo.js    #   venue / hotel / restaurant knowledge graph
│   ├── config.js         #   Wikipedia & Google Maps loaders
│   └── components/
│       ├── ChatPanel.jsx
│       ├── MapPanel.jsx
│       └── DetailsPanel.jsx
└── vite.config.js        # /api proxy to the RocketRide runtime
```

---

## 🧱 Built with

| Layer | Stack |
| ----- | ----- |
| Orchestration | [RocketRide](https://rocketride.ai) pipelines |
| Inference | [GMI Cloud](https://www.gmicloud.ai) (Google Gemini) |
| Backend | FastAPI + Uvicorn |
| Frontend | React 19 + Vite |
| Map tiles | Leaflet + CARTO Voyager |
| Venue photos | Wikipedia / Wikimedia Commons |
| Embedded maps | Google Maps Embed API |

---

<div align="center">

*Built for the 2026 World Cup. Made for fans who hate spreadsheets.* ⚽

</div>
