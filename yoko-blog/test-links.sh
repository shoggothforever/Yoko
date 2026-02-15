#!/bin/bash

# 测试网站链接的简单脚本

echo "正在测试网站链接..."

# 检查首页
echo "1. 检查首页: http://127.0.0.1"
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1
echo ""

# 检查重要的人们页面
echo "2. 检查重要的人们页面: http://127.0.0.1/important-people.html"
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/important-people.html
echo ""

# 检查所有文章页面
echo "3. 检查所有文章页面: http://127.0.0.1/all-posts.html"
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/all-posts.html
echo ""

# 检查文章页面
echo "4. 检查文章页面..."
for post in posts/*.html; do
    post_name=$(basename $post)
    echo "   - 检查 $post_name: http://127.0.0.1/$post"
    curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/$post
    echo ""
done

echo "所有链接测试完成。"