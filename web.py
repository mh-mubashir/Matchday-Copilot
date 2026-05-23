import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from rocketride import RocketRideClient
from rocketride.schema import Question

PIPE_FILE = "test.pipe"
DOCS_DIR = Path("docs")

state: dict = {}


def collect_docs() -> list[str]:
    if not DOCS_DIR.is_dir():
        return []
    return [str(p) for p in DOCS_DIR.iterdir() if p.is_file()]


def extract_answer(response: dict) -> str:
    result_types = response.get("result_types", {})
    for key, lane in result_types.items():
        if lane == "answers":
            vals = response.get(key, [])
            if vals:
                return vals[0] if isinstance(vals[0], str) else str(vals[0])
    answers = response.get("answers", [])
    return answers[0] if answers else "(no answer)"


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = RocketRideClient()
    await client.connect()

    files = collect_docs()
    if files:
        print(f"Ingesting {len(files)} file(s)...")
        r = await client.use(filepath=PIPE_FILE, source="webhook_1")
        ingest_token = r["token"]
        results = await client.send_files(files, ingest_token)
        for x in results:
            print(f"  {x.get('action')}: {x.get('filepath')}")
        try:
            await client.terminate(ingest_token)
        except Exception:
            pass
    else:
        print(f"(no files in ./{DOCS_DIR}/ — skipping ingest)")

    print("Starting chat pipeline...")
    result = await client.use(filepath=PIPE_FILE, source="chat_1", use_existing=True)
    state["client"] = client
    state["token"] = result["token"]
    print(f"Pipeline running. token={state['token']}")
    print("Open http://localhost:8000 in your browser.")

    try:
        yield
    finally:
        try:
            await client.terminate(state["token"])
        except Exception:
            pass
        await client.disconnect()


app = FastAPI(lifespan=lifespan)


class ChatIn(BaseModel):
    message: str


class ChatOut(BaseModel):
    answer: str


@app.post("/chat", response_model=ChatOut)
async def chat(body: ChatIn) -> ChatOut:
    text = body.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail="empty message")
    client: RocketRideClient = state["client"]
    token: str = state["token"]
    q = Question()
    q.addQuestion(text)
    response = await client.chat(token=token, question=q)
    return ChatOut(answer=extract_answer(response))


INDEX_HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>RAG Chat</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
  h1 { font-size: 1.2rem; margin-bottom: 1rem; }
  #log { border: 1px solid #888; border-radius: 8px; padding: 1rem; height: 60vh; overflow-y: auto; background: rgba(127,127,127,.05); }
  .msg { margin: .5rem 0; padding: .5rem .75rem; border-radius: 6px; white-space: pre-wrap; }
  .user { background: #2563eb22; align-self: end; }
  .bot  { background: #16a34a22; }
  .sys  { color: #888; font-style: italic; font-size: .9rem; }
  form { display: flex; gap: .5rem; margin-top: 1rem; }
  input[type=text] { flex: 1; padding: .6rem; font-size: 1rem; border-radius: 6px; border: 1px solid #888; }
  button { padding: .6rem 1rem; font-size: 1rem; border-radius: 6px; border: 0; background: #2563eb; color: white; cursor: pointer; }
  button:disabled { opacity: .5; cursor: wait; }
</style>
</head>
<body>
<h1>RAG Chat (Gemini + Pinecone via RocketRide)</h1>
<div id="log"></div>
<form id="f">
  <input id="m" type="text" placeholder="Ask something..." autocomplete="off" autofocus />
  <button id="b" type="submit">Send</button>
</form>
<script>
const log = document.getElementById('log');
const form = document.getElementById('f');
const input = document.getElementById('m');
const btn = document.getElementById('b');

function add(cls, text) {
  const d = document.createElement('div');
  d.className = 'msg ' + cls;
  d.textContent = text;
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  add('user', 'You: ' + text);
  input.value = '';
  btn.disabled = true;
  const thinking = add('sys', 'thinking...');
  try {
    const r = await fetch('/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await r.json();
    thinking.remove();
    if (!r.ok) {
      add('sys', 'error: ' + (data.detail || r.statusText));
    } else {
      add('bot', 'Bot: ' + (data.answer || '(no answer)'));
    }
  } catch (err) {
    thinking.remove();
    add('sys', 'request failed: ' + err.message);
  } finally {
    btn.disabled = false;
    input.focus();
  }
});
</script>
</body>
</html>
"""


@app.get("/", response_class=HTMLResponse)
async def index() -> str:
    return INDEX_HTML


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("web:app", host="127.0.0.1", port=8000, reload=False)
