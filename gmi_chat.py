import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

DOCS_DIR = Path("docs")
MODEL = "deepseek-ai/DeepSeek-R1-0528"
BASE_URL = "https://api.gmi-serving.com/v1"


def read_file(path: Path) -> str:
    if path.suffix.lower() == ".pdf":
        try:
            from pypdf import PdfReader
        except ImportError:
            print(f"[skip] {path.name}: install pypdf to read PDFs (pip install pypdf)")
            return ""
        try:
            reader = PdfReader(str(path))
            return "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as e:
            print(f"[skip] {path.name}: {e}")
            return ""
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        print(f"[skip] {path.name}: {e}")
        return ""


def load_docs() -> str:
    if not DOCS_DIR.is_dir():
        print(f"No {DOCS_DIR}/ directory found.")
        return ""
    chunks = []
    for p in sorted(DOCS_DIR.rglob("*")):
        if not p.is_file():
            continue
        text = read_file(p)
        if text.strip():
            chunks.append(f"=== FILE: {p.relative_to(DOCS_DIR)} ===\n{text}")
            print(f"  loaded {p.relative_to(DOCS_DIR)}  ({len(text):,} chars)")
    return "\n\n".join(chunks)


def main() -> None:
    load_dotenv()
    api_key = os.getenv("GMI_API_KEY")
    if not api_key:
        print("ERROR: GMI_API_KEY not set in .env")
        sys.exit(1)

    print(f"Loading documents from ./{DOCS_DIR}/ ...")
    context = load_docs()
    if not context:
        print("No documents loaded. Exiting.")
        sys.exit(1)
    print(f"Total context: {len(context):,} chars\n")

    client = OpenAI(api_key=api_key, base_url=BASE_URL)
    system_prompt = (
        "You are a helpful assistant. Answer the user's questions using ONLY the "
        "documents provided below as context. If the answer isn't in the documents, "
        "say so plainly.\n\n"
        f"--- DOCUMENTS ---\n{context}\n--- END DOCUMENTS ---"
    )
    history = [{"role": "system", "content": system_prompt}]

    print(f"Model: {MODEL}")
    print("Chat ready. Type your question, or 'quit' to exit.\n")
    while True:
        try:
            user_text = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not user_text:
            continue
        if user_text.lower() in {"quit", "exit", ":q"}:
            break

        history.append({"role": "user", "content": user_text})
        try:
            resp = client.chat.completions.create(model=MODEL, messages=history)
        except Exception as e:
            print(f"[error] {e}\n")
            history.pop()
            continue

        answer = resp.choices[0].message.content or "(empty response)"
        history.append({"role": "assistant", "content": answer})
        print(f"Bot: {answer}\n")


if __name__ == "__main__":
    main()
