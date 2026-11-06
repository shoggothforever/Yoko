#!/bin/bash
# Rebuild the blog's derived files without rewriting article bodies or
# invoking editorial audits. Compatible with macOS Bash 3.2 and Linux Bash.
set -euo pipefail

SCRIPTS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "${SCRIPTS}/oneforall.sh"
