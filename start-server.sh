#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-4173}"
HOST="${HOST:-localhost}"
PAGE="${PAGE:-editor.html}"
URL="http://${HOST}:${PORT}/${PAGE}"

cd "$(dirname "$0")"

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

if command -v python3 >/dev/null 2>&1; then
  echo "Starting local server at http://${HOST}:${PORT}"
  echo "Keep this window open while editing the site."
  python3 -m http.server "${PORT}"
elif command -v python >/dev/null 2>&1; then
  echo "Starting local server at http://${HOST}:${PORT}"
  echo "Keep this window open while editing the site."
  python -m http.server "${PORT}"
else
  echo "Python is required to run the local static server." >&2
  exit 1
fi
