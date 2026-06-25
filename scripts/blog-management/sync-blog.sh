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

set -uo pipefail

WORKSPACE="/root/.openclaw/workspace"
SCRIPTS="${WORKSPACE}/scripts/blog-management"
BLOG="${WORKSPACE}/yoko-blog"
VENV_PY="${BLOG}/.toolvenv/bin/python"          # 装了 beautifulsoup4 的解释器
LOG="${BLOG}/logs/sync-blog.log"

mkdir -p "${BLOG}/logs"
ts() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(ts)] $*" | tee -a "$LOG"; }

# normalize 需要 bs4；缺失则自动回退到系统 python（仅 audit/normalize 会失败时提示）
if [ ! -x "$VENV_PY" ] || ! "$VENV_PY" -c "import bs4" 2>/dev/null; then
  log "⚠️  未找到带 beautifulsoup4 的 venv（${VENV_PY}）。请先： $VENV_PY -m pip install beautifulsoup4"
  VENV_PY="python3"
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
  log "⚠️  发现断链，请查看日志（不阻断同步，但建议修复）"
fi

log "===== 结束（rc=$RC）====="
exit $RC
