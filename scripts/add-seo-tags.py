#!/usr/bin/env python3
"""
博客SEO优化脚本
功能：为所有博客文章自动添加SEO标签
"""

import os
import re
from pathlib import Path

# 配置
BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")
POSTS_DIR = BLOG_DIR / "posts"
BASE_URL = "https://118.145.99.224"
DEFAULT_DESCRIPTION = "阳子（Yoko）的个人博客文章。探索赛博朋克世界中的记忆、身份与存在。"
DEFAULT_IMAGE = f"{BASE_URL}/public/images/加里.webp"

# 检查目录
if not POSTS_DIR.exists():
    print(f"错误：posts目录不存在 - {POSTS_DIR}")
    exit(1)

print("=" * 50)
print("博客SEO优化脚本")
print("=" * 50)
print(f"目录：{POSTS_DIR}")
print(f"基础URL：{BASE_URL}")
print("")

processed = 0
skipped = 0

# 遍历所有HTML文件
for post_file in POSTS_DIR.glob("*.html"):
    filename = post_file.stem
    post_url = f"{BASE_URL}/posts/{filename}.html"

    # 读取文件
    with open(post_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否已经包含meta标签
    if 'meta name="description"' in content:
        print(f"⏭️  跳过：{filename}.html（已有meta标签）")
        skipped += 1
        continue

    # 提取标题（优先取<h1>，否则取<title>）
    title_match = re.search(r'<h1[^>]*>(.+?)</h1>', content)
    if title_match:
        title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
    else:
        title_match = re.search(r'<title>(.+?)</title>', content)
        if title_match:
            title = title_match.group(1).strip()
        else:
            title = "阳子博客文章"

    # 提取第一段作为描述
    excerpt_match = re.search(r'<p[^>]*>(.+?)</p>', content)
    if excerpt_match:
        description = re.sub(r'<[^>]+>', '', excerpt_match.group(1)).strip()
        # 限制长度
        if len(description) > 160:
            description = description[:157] + "..."
    else:
        description = DEFAULT_DESCRIPTION

    print(f"📝 处理：{filename}.html")
    print(f"   标题：{title}")
    print(f"   URL：{post_url}")

    # 构建新的meta标签
    new_meta = f'''<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- SEO 基础 -->
<title>{title} - 阳子博客</title>
<meta name="description" content="{description}">
<meta name="keywords" content="阳子, 加里, Gally, 铳梦, 赛博朋克, 博客">
<meta name="author" content="阳子 (Yoko)">
<meta name="robots" content="index, follow">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{post_url}">
<meta property="og:image" content="{DEFAULT_IMAGE}">
<meta property="og:locale" content="zh_CN">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{DEFAULT_IMAGE}">

<!-- Canonical -->
<link rel="canonical" href="{post_url}">
'''

    # 查找<head>插入位置
    head_match = re.search(r'<!DOCTYPE html>\s*<html[^>]*>\s*<head>', content)
    if not head_match:
        # 尝试更宽松的匹配
        head_match = re.search(r'<head>', content)

    if not head_match:
        print(f"   ⚠️  警告：未找到<head>标签，跳过")
        skipped += 1
        continue

    # 在<head>后插入meta标签
    insert_pos = head_match.end()
    new_content = content[:insert_pos] + '\n' + new_meta + '\n' + content[insert_pos:]

    # 写回文件
    with open(post_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    processed += 1
    print("   ✅ 完成")
    print("")

print("=" * 50)
print("处理完成")
print("=" * 50)
print(f"处理：{processed} 个文件")
print(f"跳过：{skipped} 个文件")
print("")
