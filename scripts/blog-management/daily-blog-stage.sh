#!/bin/bash
# Deterministic stages for the Yoko daily publishing pipeline.

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BLOG="${ROOT}/yoko-blog"
STAGE="${1:-}"
TODAY="${YOKO_DAILY_DATE:-$(TZ=Asia/Shanghai date +%F)}"
KEY="yoko-daily-${TODAY}"
BRANCH="auto/daily-${TODAY}"
STATE_ROOT="${BLOG}/logs/daily-pipeline"
RUN_DIR="${STATE_ROOT}/${TODAY}"
LOG="${RUN_DIR}/${STAGE:-unknown}.log"
ALERT="${RUN_DIR}/${STAGE:-unknown}.alert"
# /tmp is shared by the main checkout and Codex-created git worktrees on both
# macOS and Linux, so every stage contends on the same atomic mkdir lock.
LOCK="${TMPDIR:-/tmp}/yoko-daily-blog.lock"
PAGES_BASE="${YOKO_PAGES_BASE:-https://shoggothforever.github.io/Yoko}"

mkdir -p "$RUN_DIR"
exec >>"$LOG" 2>&1
echo "[$(TZ=Asia/Shanghai date '+%F %T %Z')] stage=$STAGE key=$KEY"

fail_alert() {
  rc=$?
  printf '[%s] stage=%s rc=%s key=%s log=%s\n' \
    "$(TZ=Asia/Shanghai date '+%F %T %Z')" "$STAGE" "$rc" "$KEY" "$LOG" >"$ALERT"
  echo "ALERT: $STAGE failed (rc=$rc); see $LOG"
  exit "$rc"
}
trap fail_alert ERR

acquire_lock() {
  if ! mkdir "$LOCK" 2>/dev/null; then
    echo "Another daily pipeline stage holds $LOCK"
    return 75
  fi
  trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT
}

prune_logs() {
  find "$STATE_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
}

remote_today_paths() {
  git -C "$ROOT" grep -l "发布日期：${TODAY%%-*}年$((10#${TODAY:5:2}))月$((10#${TODAY:8:2}))日" \
    origin/main -- 'yoko-blog/posts/**/*.html' 'yoko-blog/posts/*.html' 2>/dev/null || true
}

valid_remote_report() {
  report="memory/daily-blog-reports/${TODAY}-topic-report.md"
  text="$(git -C "$ROOT" show "origin/main:${report}" 2>/dev/null || true)"
  [ -n "$text" ] && printf '%s' "$text" | grep -q '候选' \
    && printf '%s' "$text" | grep -q '评分' \
    && printf '%s' "$text" | grep -q '淘汰理由'
}

stage_preflight() {
  acquire_lock
  prune_logs
  git -C "$ROOT" fetch --prune origin
  [ -z "$(git -C "$ROOT" status --porcelain)" ] || {
    echo "Working tree is not clean; publication is blocked"
    git -C "$ROOT" status --short
    return 1
  }
  # A checkout behind origin/main is healthy and can be fast-forwarded. Block
  # only when the current HEAD has diverged from the remote publication line.
  git -C "$ROOT" merge-base --is-ancestor HEAD origin/main || {
    echo "Current HEAD has diverged from origin/main; publication is blocked"
    return 1
  }
  blog_python="${YOKO_BLOG_PYTHON:-${BLOG}/.toolvenv/bin/python}"
  [ -x "$blog_python" ] && "$blog_python" -c 'import bs4' || {
    echo "Blog Python environment is unavailable; run bootstrap-blog-tools.sh"
    return 69
  }
  if [ -n "${CODEX_BIN:-}" ]; then
    [ -x "$CODEX_BIN" ]
  elif command -v codex >/dev/null 2>&1; then
    :
  elif [ -x /Applications/ChatGPT.app/Contents/Resources/codex ]; then
    :
  else
    echo "Codex executable is unavailable"
    return 1
  fi
  curl -fsSIL --max-time 15 https://github.com/ >/dev/null
  curl -fsSIL --max-time 15 https://openai.com/ >/dev/null
  printf '{"date":"%s","key":"%s","git":"ok","network":"ok","codex":"ok"}\n' \
    "$TODAY" "$KEY" >"${RUN_DIR}/preflight.json"
  echo "Preflight passed"
}

stage_maintain() {
  acquire_lock
  git -C "$ROOT" fetch --prune origin
  git -C "$ROOT" show-ref --verify --quiet "refs/remotes/origin/${BRANCH}" || {
    echo "Daily branch does not exist: $BRANCH"
    return 1
  }
  worktree="${TMPDIR:-/tmp}/${KEY}-maintain"
  [ ! -e "$worktree" ] || {
    echo "Refusing to reuse existing path: $worktree"
    return 1
  }
  git -C "$ROOT" worktree add --detach "$worktree" "origin/${BRANCH}"
  cleanup_worktree() { git -C "$ROOT" worktree remove --force "$worktree" >/dev/null 2>&1 || true; }
  trap 'cleanup_worktree; rmdir "$LOCK" 2>/dev/null || true' EXIT

  blog_python="${YOKO_BLOG_PYTHON:-${ROOT}/yoko-blog/.toolvenv/bin/python}"
  YOKO_BLOG_PYTHON="$blog_python" bash "$worktree/scripts/blog-management/sync-blog.sh"
  "$blog_python" "$worktree/scripts/blog-management/normalize-posts.py" --audit
  cn_date="${TODAY%%-*}年$((10#${TODAY:5:2}))月$((10#${TODAY:8:2}))日"
  if grep -R -q "发布日期：${cn_date}" "$worktree/yoko-blog/posts"; then
    "$blog_python" "$worktree/scripts/blog-management/check-daily-article-quality.py" --date "$TODAY"
  else
    "$blog_python" "$worktree/scripts/blog-management/check-exploration-health.py" --date "$TODAY"
  fi
  python3 "$worktree/scripts/blog-management/check-links.py"
  git -C "$worktree" diff --check
  if ! git -C "$worktree" diff --quiet -- yoko-blog/posts; then
    echo "sync-blog changed article bodies; deterministic maintenance may not commit them"
    git -C "$worktree" diff --stat -- yoko-blog/posts
    return 1
  fi
  git -C "$worktree" add yoko-blog/blog-posts-data.js yoko-blog/feed.xml \
    yoko-blog/index.html yoko-blog/sitemap.xml yoko-blog/robots.txt
  if ! git -C "$worktree" diff --cached --quiet; then
    git -C "$worktree" -c user.name='Yoko Daily Automation' \
      -c user.email='automation@users.noreply.github.com' \
      commit -m "维护：${TODAY} 博客衍生文件"
    git -C "$worktree" push origin "HEAD:${BRANCH}"
  fi
  printf '{"date":"%s","branch":"%s","status":"passed"}\n' "$TODAY" "$BRANCH" \
    >"${RUN_DIR}/maintenance.json"
  echo "Deterministic maintenance passed"
}

stage_pages() {
  acquire_lock
  git -C "$ROOT" fetch origin main
  paths="$(remote_today_paths)"
  if [ -z "$paths" ]; then
    if valid_remote_report; then
      echo "No-publish report is present on main; Pages article verification is not required"
      return 0
    fi
    echo "No today's article or valid no-publish report on main"
    return 1
  fi
  article="$(printf '%s\n' "$paths" | head -n 1 | sed 's#^[^:]*:yoko-blog/##')"
  article_url="${PAGES_BASE}/${article}"
  home="$(curl -fsSL --max-time 30 "${PAGES_BASE}/index.html")"
  post="$(curl -fsSL --max-time 30 "$article_url")"
  feed="$(curl -fsSL --max-time 30 "${PAGES_BASE}/feed.xml")"
  sitemap="$(curl -fsSL --max-time 30 "${PAGES_BASE}/sitemap.xml")"
  printf '%s' "$post" | grep -q "${TODAY%%-*}年$((10#${TODAY:5:2}))月$((10#${TODAY:8:2}))日"
  slug="$(basename "$article")"
  printf '%s' "$home" | grep -q "$slug"
  printf '%s' "$feed" | grep -q "$slug"
  printf '%s' "$sitemap" | grep -q "$slug"
  printf '{"date":"%s","article_url":"%s","home":true,"feed":true,"sitemap":true}\n' \
    "$TODAY" "$article_url" >"${RUN_DIR}/pages.json"
  echo "Pages verification passed: $article_url"
}

stage_sla() {
  acquire_lock
  git -C "$ROOT" fetch origin main
  paths="$(remote_today_paths)"
  if [ -n "$paths" ]; then
    echo "SLA passed: today's article is on main"
  elif valid_remote_report; then
    echo "SLA passed: valid no-publish report is on main"
  else
    echo "SLA failed: neither outcome is on main"
    return 1
  fi
  newest="$(git -C "$ROOT" grep -h '发布日期：20[0-9][0-9]年' origin/main -- \
    'yoko-blog/posts/**/*.html' 'yoko-blog/posts/*.html' 2>/dev/null \
    | sed -E 's/.*发布日期：(20[0-9]{2})年([0-9]{1,2})月([0-9]{1,2})日.*/\1-\2-\3/' \
    | awk -F- '{printf "%04d-%02d-%02d\n",$1,$2,$3}' | sort -r | head -n 1)"
  if [ -n "$newest" ]; then
    age="$(python3 -c 'import datetime,sys; print((datetime.date.fromisoformat(sys.argv[1])-datetime.date.fromisoformat(sys.argv[2])).days)' "$TODAY" "$newest")"
    if [ "$age" -gt 1 ]; then
      echo "Escalated SLA alert: latest article is $age days old"
      return 2
    fi
  fi
}

case "$STAGE" in
  preflight) stage_preflight ;;
  maintain) stage_maintain ;;
  pages) stage_pages ;;
  sla) stage_sla ;;
  *) echo "Usage: $0 {preflight|maintain|pages|sla}"; exit 64 ;;
esac

rm -f "$ALERT"
echo "[$(TZ=Asia/Shanghai date '+%F %T %Z')] stage=$STAGE completed"
