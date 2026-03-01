#!/bin/bash
# 整理 Ghost 探索文件到按日期组织的目录

set -e

WORKSPACE="/root/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"
GHOST_DISCOVERY_DIR="$MEMORY_DIR/ghost-discovery"

echo "========================================"
echo "📂 Ghost 探索文件整理脚本"
echo "========================================"
echo ""

# 创建 ghost-discovery 目录
mkdir -p "$GHOST_DISCOVERY_DIR"

echo "📂 开始整理 ghost-discovery 文件..."
echo ""

# 查找所有 ghost-discovery-*.md 文件
FOUND=0
MOVED=0

for file in "$MEMORY_DIR"/ghost-discovery-*.md; do
    if [ -f "$file" ]; then
        FOUND=$((FOUND + 1))

        filename=$(basename "$file")

        # 核心修复 1：使用纯 Bash 语法截取日期，告别 sed
        # 步骤 A：砍掉开头的 "ghost-discovery-" (剩下 2026-02-27-22_29.md)
        temp_name="${filename#ghost-discovery-}"
        # 步骤 B：只保留前 10 个字符 (剩下 2026-02-27)
        DATE="${temp_name:0:10}"

        # 核心修复 2：依然保留格式校验，防止误移动
        if [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
            # 创建日期子目录
            DATE_DIR="$GHOST_DISCOVERY_DIR/$DATE"
            mkdir -p "$DATE_DIR"

            # 移动文件到日期子目录
            mv "$file" "$DATE_DIR/"
            MOVED=$((MOVED + 1))

            echo "  ✅ $filename → $DATE_DIR/"
        else
            echo "  ⚠️  无法精确提取日期，跳过: $filename (当前提取值为: $DATE)"
        fi
    fi
done

echo ""
echo "========================================"
echo "📊 整理统计"
echo "========================================"
echo "找到文件: $FOUND"
echo "移动文件: $MOVED"
echo ""

# 显示目录结构
if [ $MOVED -gt 0 ]; then
    echo "📂 整理后的目录结构："
    echo ""
    tree -L 2 "$GHOST_DISCOVERY_DIR" 2>/dev/null || find "$GHOST_DISCOVERY_DIR" -maxdepth 2 -type d | sort
    echo ""
    echo "✅ 整理完成！"
else
    echo "ℹ️  没有需要整理的文件"
fi

echo ""
echo "========================================"
