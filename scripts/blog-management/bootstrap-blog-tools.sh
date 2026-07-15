#!/bin/bash
# Create the repo-local, portable Python environment used by blog gates.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
VENV="${ROOT}/yoko-blog/.toolvenv"
PYTHON="${PYTHON:-python3}"

"$PYTHON" -m venv "$VENV"
"$VENV/bin/python" -m pip install --upgrade pip
"$VENV/bin/python" -m pip install -r "${SCRIPT_DIR}/requirements-blog-tools.txt"
"$VENV/bin/python" -c 'import bs4; print("blog tools ready: beautifulsoup4", bs4.__version__)'
