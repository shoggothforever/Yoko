#!/usr/bin/env python3
"""
自动生成 sitemap.xml
根据 posts 目录下的实际 HTML 文件和其他页面生成 sitemap
"""

import os
import re
from pathlib import Path
from datetime import datetime

# 路径配置
BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")
POSTS_DIR = BLOG_DIR / "posts"
SITEMAP_FILE = BLOG_DIR / "sitemap.xml"

# 域名配置（使用域名而不是IP）
BASE_URL = "https://yoko.sfct.top"  # 或者使用 "https://118.145.99.224"

def get_file_lastmod(file_path):
    """获取文件最后修改时间，格式化为 YYYY-MM-DD"""
    mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
    return mod_time.strftime("%Y-%m-%d")

def generate_sitemap():
    """生成 sitemap.xml 内容"""
    
    sitemap_urls = []
    
    # 1. 添加主要页面
    main_pages = [
        ("index.html", "1.0", "daily"),
        ("important-people.html", "0.8", "weekly"),
        ("all-posts.html", "0.9", "weekly"),
        ("ghost-chatroom.html", "0.9", "weekly"),
    ]
    
    for page, priority, changefreq in main_pages:
        page_path = BLOG_DIR / page
        if page_path.exists():
            sitemap_urls.append({
                'loc': f"{BASE_URL}/{page}",
                'lastmod': get_file_lastmod(page_path),
                'priority': priority,
                'changefreq': changefreq
            })
            print(f"  ✓ 主页面：{page}")
    
    # 2. 添加所有博客文章
    html_files = sorted(POSTS_DIR.glob("*.html"))
    
    for html_file in html_files:
        sitemap_urls.append({
            'loc': f"{BASE_URL}/posts/{html_file.name}",
            'lastmod': get_file_lastmod(html_file),
            'priority': "0.7",
            'changefreq': "monthly"
        })
        print(f"  ✓ 文章：{html_file.name}")
    
    # 3. 生成 XML
    urlset_xml = ""
    for url in sitemap_urls:
        urlset_xml += f'''    <url>
        <loc>{url['loc']}</loc>
        <lastmod>{url['lastmod']}</lastmod>
        <changefreq>{url['changefreq']}</changefreq>
        <priority>{url['priority']}</priority>
    </url>
'''
    
    template = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urlset_xml}</urlset>'''
    
    return template

def main():
    """主函数"""
    print("正在生成 sitemap.xml...")
    
    # 确保目录存在
    if not POSTS_DIR.exists():
        print(f"错误：文章目录不存在：{POSTS_DIR}")
        return
    
    # 生成 sitemap
    sitemap_content = generate_sitemap()
    
    # 写入文件
    SITEMAP_FILE.write_text(sitemap_content, encoding='utf-8')
    
    print(f"\n✅ 成功生成：{SITEMAP_FILE}")
    print(f"   域名：{BASE_URL}")

if __name__ == "__main__":
    main()
