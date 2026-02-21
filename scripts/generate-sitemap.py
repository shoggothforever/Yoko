#!/usr/bin/env python3
"""
生成sitemap.xml
"""

import os
from datetime import datetime
from pathlib import Path

# 配置
BASE_URL = "https://118.145.99.224"
BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")

# 主要页面（包含优先级和更新频率）
MAIN_PAGES = [
    {"path": "index.html", "priority": "1.0", "changefreq": "daily"},
    {"path": "important-people.html", "priority": "0.8", "changefreq": "weekly"},
    {"path": "all-posts.html", "priority": "0.9", "changefreq": "weekly"},
    {"path": "ghost-chatroom.html", "priority": "0.9", "changefreq": "weekly"},
]

# 获取所有博客文章
POSTS_DIR = BLOG_DIR / "posts"
blog_posts = []

if POSTS_DIR.exists():
    for post_file in sorted(POSTS_DIR.glob("*.html")):
        # 提取文件名作为日期（如果文件名包含日期）
        filename = post_file.stem
        blog_posts.append({
            "path": f"posts/{post_file.name}",
            "priority": "0.7",
            "changefreq": "monthly",
        })

# 生成sitemap.xml内容
sitemap_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
'''

# 添加主要页面
current_date = datetime.now().strftime("%Y-%m-%d")

for page in MAIN_PAGES:
    url = f"{BASE_URL}/{page['path']}"
    priority = page["priority"]
    changefreq = page["changefreq"]

    sitemap_content += f'''    <url>
        <loc>{url}</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>
'''

# 添加博客文章
for post in blog_posts:
    url = f"{BASE_URL}/{post['path']}"
    priority = post["priority"]
    changefreq = post["changefreq"]

    sitemap_content += f'''    <url>
        <loc>{url}</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>
'''

sitemap_content += '''</urlset>'''

# 写入文件
output_file = BLOG_DIR / "sitemap.xml"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print("=" * 50)
print("sitemap.xml 生成完成")
print("=" * 50)
print(f"文件路径：{output_file}")
print(f"URL总数：{len(MAIN_PAGES) + len(blog_posts)}")
print(f"  - 主要页面：{len(MAIN_PAGES)} 个")
print(f"  - 博客文章：{len(blog_posts)} 个")
print(f"\n访问地址：{BASE_URL}/sitemap.xml")
print("")
