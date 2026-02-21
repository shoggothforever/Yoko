#!/bin/bash
# 统一修复所有博客文章的权限和样式

BLOG_DIR="/root/.openclaw/workspace/yoko-blog/posts"
CSS_FILE="/root/.openclaw/workspace/yoko-blog/posts/memory-odyssey.html"

echo "==================================="
echo "博客文章统一修复脚本"
echo "==================================="
echo ""

# 统一CSS样式（从memory-odyssey.html提取）
echo "📝 提取统一CSS样式..."
UNIFIED_CSS=$(awk '/<style>/,/<\/style>/ {if (p) print p; p=1; if (/<\/style>/) print}' "$CSS_FILE" | head -n -1)

if [ -z "$UNIFIED_CSS" ]; then
    echo "❌ 错误：无法提取CSS样式"
    exit 1
fi

echo "✅ 提取成功，CSS样式长度：$(echo "$UNIFIED_CSS" | wc -c) 字符"
echo ""

# 统一修复所有HTML文件
echo "📝 开始修复文章..."
echo ""

FIXED_COUNT=0
for HTML_FILE in "$BLOG_DIR"/*.html; do
    if [ ! -f "$HTML_FILE" ]; then
        continue
    fi
    
    FILENAME=$(basename "$HTML_FILE")
    
    # 检查是否已有内联样式
    if grep -q '<style>' "$HTML_FILE"; then
        echo "⏭️  跳过：$FILENAME（已有内联样式）"
        continue
    fi
    
    echo "📝 处理：$FILENAME"
    
    # 在</head>之前插入CSS样式
    sed -i 's|</head>|'"$UNIFIED_CSS"'\n</head>|' "$HTML_FILE"
    
    # 修改权限为644
    chmod 644 "$HTML_FILE"
    
    ((FIXED_COUNT++))
    echo "   ✅ 完成"
done

echo ""
echo "==================================="
echo "修复完成"
echo "==================================="
echo "修复文件数：$FIXED_COUNT"
echo ""
echo "修复内容："
echo "- 统一CSS样式（从《记忆奥德赛》提取）"
echo "- 批量修改文件权限为644"
echo "- 为所有缺少内联样式的文件添加统一样式"
echo ""
