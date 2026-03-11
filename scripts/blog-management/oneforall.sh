#!/bin/bash
#
# oneforall.sh - 博客管理一键同步脚本
#
# 功能：
#   1. 生成 blog-posts-data.js（扫描 posts/ 提取文章元数据）
#   2. 生成 sitemap.xml + robots.txt
#   3. 更新 index.html 博客列表
#
# 用法：
#   bash scripts/blog-management/oneforall.sh
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 路径配置
WORKSPACE_DIR="/root/.openclaw/workspace"
SCRIPTS_DIR="${WORKSPACE_DIR}/scripts/blog-management"
BLOG_DIR="${WORKSPACE_DIR}/yoko-blog"

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🚀 博客管理一键同步脚本 v2.0     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# 检查目录
if [ ! -d "$BLOG_DIR" ]; then
    echo -e "${RED}❌ 错误：博客目录不存在：$BLOG_DIR${NC}"
    exit 1
fi

if [ ! -d "$SCRIPTS_DIR" ]; then
    echo -e "${RED}❌ 错误：脚本目录不存在：$SCRIPTS_DIR${NC}"
    exit 1
fi

# 检查 posts 目录
POST_COUNT=$(find "${BLOG_DIR}/posts" -name "*.html" | wc -l)
echo -e "${GREEN}📂 检测到 ${POST_COUNT} 篇文章${NC}"
echo ""

# 切换到工作目录
cd "$WORKSPACE_DIR"

# ── Step 1: 生成 blog-posts-data.js ─────────────────────────
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}[1/3] 📝 生成 blog-posts-data.js ...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
python3 "${SCRIPTS_DIR}/generate-all-posts.py"
echo ""

# ── Step 2: 生成 sitemap.xml + robots.txt ────────────────────
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}[2/3] 🗺️  生成 sitemap.xml + robots.txt ...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
python3 "${SCRIPTS_DIR}/generate-sitemap.py"
echo ""

# ── Step 3: 更新 index.html 博客列表 ────────────────────────
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}[3/3] 🏠 更新 index.html 博客列表 ...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
python3 "${SCRIPTS_DIR}/update-index-blog-list.py"
echo ""

# ── 完成 ─────────────────────────────────────────────────────
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   ✅ 所有任务完成！                 ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}生成的文件：${NC}"
echo "  📝 yoko-blog/blog-posts-data.js"
echo "  🗺️  yoko-blog/sitemap.xml"
echo "  🤖 yoko-blog/robots.txt"
echo "  🏠 yoko-blog/index.html (博客列表已更新)"
echo ""
echo -e "${YELLOW}下一步操作：${NC}"
echo "  cd $WORKSPACE_DIR"
echo "  git add yoko-blog/"
echo "  git commit -m '同步博客列表和sitemap'"
echo "  git push"
echo ""
