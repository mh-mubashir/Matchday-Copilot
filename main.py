import asyncio
import os
import sys
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from rocketride import RocketRideClient
from rocketride.schema import Question

PIPE_FILE = "test.pipe"
DOCS_DIR = Path("docs")

_input_pool = ThreadPoolExecutor(max_workers=1)


async def async_input(prompt: str = "") -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_input_pool, input, prompt)


def collect_docs() -> list[str]:
    if not DOCS_DIR.is_dir():
        return []
    return [str(p) for p in DOCS_DIR.iterdir() if p.is_file()]


async def ingest(client: RocketRideClient, token: str, files: list[str]) -> None:
    print(f"Ingesting {len(files)} file(s) into Pinecone...")
    results = await client.send_files(files, token)
    for r in results:
        action = r.get("action")
        path = r.get("filepath")
        if action == "complete":
            print(f"  ok   {path}  ({r.get('upload_time', 0):.2f}s)")
        else:
            print(f"  FAIL {path}  {r.get('error', action)}")


def extract_answer(response: dict) -> str:
    result_types = response.get("result_types", {})
    for key, lane in result_types.items():
        if lane == "answers":
            vals = response.get(key, [])
            if vals:
                return vals[0] if isinstance(vals[0], str) else str(vals[0])
    answers = response.get("answers", [])
    return answers[0] if answers else "(no answer)"


async def chat_loop(client: RocketRideClient, token: str) -> None:
    print("\nChat ready. Type your question, or 'quit' to exit.\n")
    while True:
        try:
            user_text = (await async_input("You: ")).strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return
        if not user_text:
            continue
        if user_text.lower() in {"quit", "exit", ":q"}:
            return

        q = Question()
        q.addQuestion(user_text)
        response = await client.chat(token=token, question=q)
        print(f"Bot: {extract_answer(response)}\n")


async def main() -> None:
    if not os.getenv("ROCKETRIDE_APIKEY"):
        # python-dotenv isn't required for RocketRideClient (it reads .env itself),
        # but warn early so the user knows to fill it in.
        from_env = Path(".env").read_text(encoding="utf-8") if Path(".env").exists() else ""
        if "ROCKETRIDE_APIKEY=" not in from_env or "ROCKETRIDE_APIKEY=\n" in from_env or from_env.rstrip().endswith("ROCKETRIDE_APIKEY="):
            print("ERROR: ROCKETRIDE_APIKEY is empty in .env. Set it from the VSCode extension settings.")
            sys.exit(1)

    client = RocketRideClient()
    await client.connect()
    try:
        files = collect_docs()
        if files:
            print(f"Starting pipeline (ingest mode, source=webhook_1)")
            ingest_result = await client.use(filepath=PIPE_FILE, source="webhook_1")
            ingest_token = ingest_result["token"]
            await ingest(client, ingest_token, files)
            try:
                await client.terminate(ingest_token)
            except Exception:
                pass
        else:
            print(f"(no files in ./{DOCS_DIR}/ — skipping ingest; will query existing Pinecone collection)")

        print(f"Starting pipeline (chat mode, source=chat_1)")
        result = await client.use(filepath=PIPE_FILE, source="chat_1", token=f"tk_{uuid.uuid4().hex}")
        token = result["token"]
        print(f"Pipeline running. token={token}")

        await chat_loop(client, token)

        print("Shutting down...")
        try:
            await client.terminate(token)
        except Exception as e:
            print(f"(terminate warning: {e})")
    finally:
        await client.disconnect()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
