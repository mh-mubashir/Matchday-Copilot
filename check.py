"""Verify the RocketRide setup: SDK import, .env config, server connectivity."""
import asyncio
import os
import sys
from pathlib import Path


def check_env() -> bool:
    env_file = Path(__file__).with_name(".env")
    if not env_file.exists():
        print("[FAIL] .env not found. Open the .pipe file in VSCode so the "
              "RocketRide extension generates it, or copy env.example to .env.")
        return False

    found = {"ROCKETRIDE_URI": None, "ROCKETRIDE_APIKEY": None}
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        k, v = k.strip(), v.strip().strip('"').strip("'")
        if k in found:
            found[k] = v

    ok = True
    for k, v in found.items():
        if not v or v == "your-api-key-here":
            print(f"[FAIL] {k} is missing or unset in .env")
            ok = False
        else:
            shown = v if k == "ROCKETRIDE_URI" else v[:4] + "..." + v[-4:]
            print(f"[ OK ] {k} = {shown}")
    return ok


async def check_connection() -> bool:
    try:
        from rocketride import RocketRideClient
    except Exception as e:
        print(f"[FAIL] cannot import rocketride: {e}")
        return False
    print(f"[ OK ] rocketride SDK importable")

    client = RocketRideClient()
    try:
        await client.connect()
        await client.ping()
        print("[ OK ] connected and pinged RocketRide server")
        return True
    except Exception as e:
        print(f"[FAIL] connection error: {e}")
        return False
    finally:
        try:
            await client.disconnect()
        except Exception:
            pass


def check_pipe_file() -> bool:
    pipe = Path(__file__).with_name(".pipe")
    if not pipe.exists():
        print("[WARN] no .pipe file in this directory")
        return True
    import json
    try:
        data = json.loads(pipe.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"[FAIL] .pipe is not valid JSON: {e}")
        return False
    n = len(data.get("components", []))
    print(f"[ OK ] .pipe loaded (project_id={data.get('project_id')!r}, "
          f"{n} component(s))")
    if n == 0:
        print("       (empty pipeline — open the .pipe file in VSCode to "
              "drag in components from the RocketRide palette)")
    return True


async def main() -> int:
    print("--- RocketRide setup check ---")
    ok_pipe = check_pipe_file()
    ok_env = check_env()
    ok_conn = await check_connection() if ok_env else False
    print("------------------------------")
    if ok_pipe and ok_env and ok_conn:
        print("All checks passed.")
        return 0
    print("Some checks failed. See messages above.")
    return 1


if __name__ == "__main__":
    if sys.platform.startswith("win"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(asyncio.run(main()))
