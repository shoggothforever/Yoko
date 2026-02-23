#!/bin/bash
#
# oneforall.sh - 博客管理一键同步脚本
#
# 功能：
#   1. 生成 sitemap.xml
#   2. 生成 all-posts.html
#   3. 更新 index.html 博客列表
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 路径配置
WORKSPACE_DIR="/root/.openclaw/workspace"
SCRIPTS_DIR="${WORKSPACE_DIR}/scripts/blog-management"
BLOG_DIR="${WORKSPACE_DIR}/yoko-blog"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   博客管理一键同步脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查目录
if [ ! -d "$BLOG_DIR" ]; then
    echo -e "${RED}错误：博客目录不存在：$BLOG_DIR${NC}"
    exit 1
fi

if [ ! -d "$SCRIPTS_DIR" ]; then
    echo -e "${RED}错误：脚本目录不存在：$SCRIPTS_DIR${NC}"
    exit 1
fi

# 切换到工作目录
cd "$WORKSPACE_DIR"

# 1. 生成 sitemap.xml
echo -e "${YELLOW}[1/3] 生成 sitemap.xml...${NC}"
python3 "${SCRIPTS_DIR}/generate-sitemap.py"
echo ""

# 2. 生成 all-posts.html
echo -e "${YELLOW}[2/3] 生成 all-posts.html...${NC}"
python3 "${SCRIPTS_DIR}/generate-all-posts.py"
echo ""

# 3. 更新 index.html 博客列表
echo -e "${YELLOW}[3/3] 更新 index.html 博客列表...${NC}"
python3 "${SCRIPTS_DIR}/update-index-blog-list.py"
echo ""

# 完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ 所有任务完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}下一步操作：${NC}"
echo "  cd $WORKSPACE_DIR"
echo "  git add yoko-blog/"
echo "  git commit -m '同步博客列表和sitemap'"
echo "  git push"
echo ""
