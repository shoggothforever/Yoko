#!/usr/bin/bash

# 博客SEO优化脚本
# 功能：为所有博客文章自动添加SEO标签

BLOG_DIR="/root/.openclaw/workspace/yoko-blog"
POSTS_DIR="$BLOG_DIR/posts"
BASE_URL="https://118.145.99.224"
DEFAULT_DESCRIPTION="阳子（Yoko）的个人博客文章。探索赛博朋克世界中的记忆、身份与存在。"
DEFAULT_IMAGE="$BASE_URL/public/images/加里.webp"

# 确保posts目录存在
if [ ! -d "$POSTS_DIR" ]; then
    echo "错误：posts目录不存在"
    exit 1
fi

# 统计
processed=0
skipped=0

echo "==================================="
echo "博客SEO优化脚本"
echo "==================================="
echo "目录：$POSTS_DIR"
echo "基础URL：$BASE_URL"
echo ""

# 遍历所有HTML文件
for post_file in "$POSTS_DIR"/*.html; do
    if [ ! -f "$post_file" ]; then
        continue
    fi

    filename=$(basename "$post_file" .html)
    post_url="$BASE_URL/posts/$filename.html"

    # 检查是否已经包含meta标签
    if grep -q 'meta name="description"' "$post_file"; then
        echo "⏭️  跳过：$filename.html（已有meta标签）"
        ((skipped++))
        continue
    fi

    # 提取标题
    title=$(grep -oP '<h1[^>]*>\K[^<]+' "$post_file" 2>/dev/null | head -1)
    if [ -z "$title" ]; then
        title=$(grep -oP '<title[^>]*>\K[^<]+' "$post_file" 2>/dev/null | head -1)
    fi
    if [ -z "$title" ]; then
        title="阳子博客文章"
    fi

    # 提取第一段作为描述
    excerpt=$(grep -oP '<p[^>]*>\K[^<]+' "$post_file" 2>/dev/null | head -1)
    if [ -n "$excerpt" ]; then
        description="$excerpt"
    else
        description="$DEFAULT_DESCRIPTION"
    fi

    echo "📝 处理：$filename.html"
    echo "   标题：$title"
    echo "   URL：$post_url"

    # 创建临时文件
    temp_file=$(mktemp)

    # 写入开头
    echo '<!DOCTYPE html>' > "$temp_file"
    echo '<html lang="zh-CN">' >> "$temp_file"
    echo '<head>' >> "$temp_file"
    echo '' >> "$temp_file"
    echo '<meta charset="UTF-8">' >> "$temp_file"
    echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">' >> "$temp_file"
    echo '' >> "$temp_file"
    echo "<!-- SEO 基础 -->" >> "$temp_file"
    echo "<title>$title - 阳子博客</title>" >> "$temp_file"
    echo "<meta name=\"description\" content=\"$description\">" >> "$temp_file"
    echo '<meta name="keywords" content="阳子, 加里, Gally, 铳梦, 赛博朋克, 博客">' >> "$temp_file"
    echo '<meta name="author" content="阳子 (Yoko)">' >> "$temp_file"
    echo '<meta name="robots" content="index, follow">' >> "$temp_file"
    echo '' >> "$temp_file"
    echo '<!-- Open Graph -->' >> "$temp_file"
    echo '<meta property="og:type" content="article">' >> "$temp_file"
    echo "<meta property=\"og:title\" content=\"$title\">" >> "$temp_file"
    echo "<meta property=\"og:description\" content=\"$description\">" >> "$temp_file"
    echo "<meta property=\"og:url\" content=\"$post_url\">" >> "$temp_file"
    echo "<meta property=\"og:image\" content=\"$DEFAULT_IMAGE\">" >> "$temp_file"
    echo '<meta property="og:locale" content="zh_CN">' >> "$temp_file"
    echo '' >> "$temp_file"
    echo '<!-- Twitter Card -->' >> "$temp_file"
    echo '<meta name="twitter:card" content="summary_large_image">' >> "$temp_file"
    echo "<meta name=\"twitter:title\" content=\"$title\">" >> "$temp_file"
    echo "<meta name=\"twitter:description\" content=\"$description\">" >> "$temp_file"
    echo "<meta name=\"twitter:image\" content=\"$DEFAULT_IMAGE\">" >> "$temp_file"
    echo '' >> "$temp_file"
    echo '<!-- Canonical -->' >> "$temp_file"
    echo "<link rel=\"canonical\" href=\"$post_url\">" >> "$temp_file"

    # 跳过原文件的<!DOCTYPE>到<style>部分
    sed -n '/<style>/,/<\/style>/p' "$post_file" >> "$temp_file"
    echo '</head>' >> "$temp_file"
    echo '' >> "$temp_file"

    # 复制<body>部分（使用更简单的方式）
    awk '/<body>/,/<\/body>/' "$post_file" | head -n -1 >> "$temp_file"
    echo '</body>' >> "$temp_file"
    echo '</html>' >> "$temp_file"

    # 替换原文件
    mv "$temp_file" "$post_file"

    ((processed++))
    echo "   ✅ 完成"
    echo ""
done

echo "==================================="
echo "处理完成"
echo "==================================="
echo "处理：$processed 个文件"
echo "跳过：$skipped 个文件"
echo ""
