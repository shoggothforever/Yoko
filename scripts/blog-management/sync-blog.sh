#!/bin/bash
#
# sync-blog.sh — yoko-blog 日常维护一键脚本（确定性、不依赖 LLM）
#
# 顺序：
#   1. normalize-posts.py --apply  → 把任何漂移文章重新套用标准模板、补元数据、修权限
#   2. oneforall.sh                → 重生成 blog-posts-data.js / sitemap.xml / robots.txt / 首页列表
#   3. normalize-posts.py --audit  → 结构合规复检（不合规则非 0 退出，便于告警）
#
# 用法：bash scripts/blog-management/sync-blog.sh
# 建议由系统 crontab 在每日文章生成之后调用（见 BLOG-ARTICLE-STANDARDS.md）。

set -euo pipefail

SCRIPTS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="$(cd "${SCRIPTS}/../.." && pwd)"
BLOG="${WORKSPACE}/yoko-blog"
VENV_PY="${YOKO_BLOG_PYTHON:-}"
LOG="${BLOG}/logs/sync-blog.log"

mkdir -p "${BLOG}/logs"
ts() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(ts)] $*" | tee -a "$LOG"; }

# normalize 需要 bs4。依次尝试显式环境、当前 checkout 的 venv、git
# common-dir 对应主 checkout 的 venv（支持隔离 worktree），以及系统 Python。
if [ -z "$VENV_PY" ]; then
  CANDIDATES=("${BLOG}/.toolvenv/bin/python")
  if command -v git >/dev/null 2>&1 && git -C "$WORKSPACE" rev-parse --git-common-dir >/dev/null 2>&1; then
    COMMON_GIT="$(git -C "$WORKSPACE" rev-parse --git-common-dir)"
    case "$COMMON_GIT" in
      /*) ;;
      *) COMMON_GIT="${WORKSPACE}/${COMMON_GIT}" ;;
    esac
    CANDIDATES+=("$(cd "$(dirname "$COMMON_GIT")" && pwd)/yoko-blog/.toolvenv/bin/python")
  fi
  CANDIDATES+=("$(command -v python3 2>/dev/null || true)")
  for candidate in "${CANDIDATES[@]}"; do
    if [ -n "$candidate" ] && [ -x "$candidate" ] && "$candidate" -c "import bs4" 2>/dev/null; then
      VENV_PY="$candidate"
      break
    fi
  done
fi
if [ -z "$VENV_PY" ] || [ ! -x "$VENV_PY" ] || ! "$VENV_PY" -c "import bs4" 2>/dev/null; then
  log "❌ 缺少博客工具环境：${VENV_PY}（需要 beautifulsoup4）"
  log "   运行 scripts/blog-management/bootstrap-blog-tools.sh，或设置 YOKO_BLOG_PYTHON"
  exit 69
fi

log "===== 开始 yoko-blog 同步 ====="

log "[1/3] 归一化文章模板 ..."
"$VENV_PY" "${SCRIPTS}/normalize-posts.py" --apply >>"$LOG" 2>&1

log "[2/3] 重生成索引 / sitemap / 首页列表 ..."
bash "${SCRIPTS}/oneforall.sh" >>"$LOG" 2>&1

log "[3/4] 合规复检 ..."
if "$VENV_PY" "${SCRIPTS}/normalize-posts.py" --audit >>"$LOG" 2>&1; then
  log "✅ 全部文章合规"
  RC=0
else
  log "❌ 复检发现不合规文章，请查看上面的审计输出"
  RC=1
fi

log "[4/4] 链接连通性体检 ..."
if python3 "${SCRIPTS}/check-links.py" >>"$LOG" 2>&1; then
  log "✅ 无断链"
else
  log "❌ 发现断链，阻断同步，请查看日志"
  RC=1
fi

log "===== 结束（rc=${RC}）====="
exit "${RC}"
