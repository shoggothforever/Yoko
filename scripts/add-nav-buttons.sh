#!/bin/bash
# 为所有博客文章添加标准导航按钮

POSTS_DIR="/root/.openclaw/workspace/yoko-blog/posts"
TEMP_DIR="/tmp/blog-nav-$$"

# 创建临时目录
mkdir -p "$TEMP_DIR"

echo "=========================================="
echo "   博客文章导航按钮添加脚本"
echo "=========================================="
echo ""

# 导航按钮模板
NAV_BUTTONS='<!-- 导航按钮 -->
<div class="nav-buttons">
    <a href="../index.html#blog" class="nav-button">返回博客列表</a>
</div>'

# 统计
total=0
updated=0
skipped=0

# 遍历所有HTML文件
for file in "$POSTS_DIR"/*.html; do
    ((total++))
    filename=$(basename "$file")
    
    # 检查是否已有 nav-buttons
    if grep -q "nav-buttons" "$file"; then
        echo "⏭️  跳过：$filename（已有导航按钮）"
        ((skipped++))
        continue
    fi
    
    # 检查是否有 </article>
    if ! grep -q "</article>" "$file"; then
        echo "❌ 跳过：$filename（缺少 </article> 标签）"
        ((skipped++))
        continue
    fi
    
    # 在 </article> 后添加导航按钮
    sed '/<\/article>/a\
\
'"$NAV_BUTTONS" "$file" > "$TEMP_DIR/$filename"
    
    # 移动替换后的文件
    mv "$TEMP_DIR/$filename" "$file"
    
    echo "✅ 更新：$filename"
    ((updated++))
done

# 清理临时目录
rm -rf "$TEMP_DIR"

echo ""
echo "=========================================="
echo "   处理完成"
echo "=========================================="
echo "总计：$total 篇"
echo "更新：$updated 篇"
echo "跳过：$skipped 篇"
echo ""

if [ $updated -gt 0 ]; then
    echo "✅ 已为 $updated 篇文章添加标准导航按钮"
    echo ""
    echo "建议执行："
    echo "  cd /root/.openclaw/workspace"
    echo "  git add yoko-blog/posts/"
    echo "  git commit -m '为博客文章添加标准导航按钮'"
    echo "  git push"
fi
