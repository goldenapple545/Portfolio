#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-4173}"
HOST="${HOST:-localhost}"
PAGE="${PAGE:-projects.html}"

cd "$(dirname "$0")"

find_free_port() {
  local start_port="$1"
  local python_bin="$2"

  "$python_bin" - "$start_port" <<'PY'
import socket
import sys

port = int(sys.argv[1])

while port < 65535:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            port += 1
            continue

    print(port)
    break
else:
    raise SystemExit("No free port found")
PY
}

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "Python is required to run the local static server." >&2
  exit 1
fi

REQUESTED_PORT="${PORT}"
PORT="$(find_free_port "${PORT}" "${PYTHON_BIN}")"
URL="http://${HOST}:${PORT}/${PAGE}"

if [[ "${PORT}" != "${REQUESTED_PORT}" ]]; then
  echo "Port ${REQUESTED_PORT} is busy, using ${PORT} instead."
fi

open_browser() {
  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -Command "Start-Process '${URL}'" >/dev/null 2>&1 || true
  elif command -v cmd.exe >/dev/null 2>&1; then
    cmd.exe /c start "" "$URL" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$URL" >/dev/null 2>&1 || true
  fi
}

echo "Opening ${URL}"
(sleep 1 && open_browser) &

echo "Starting local server at http://${HOST}:${PORT}"
echo "Keep this window open while editing the site."
"${PYTHON_BIN}" ./scripts/local-server.py "${PORT}"
