#!/usr/bin/env python3
"""
generate-sitemap.py — 生成 sitemap.xml 和 robots.txt
扫描 yoko-blog/ 下的主要页面和 posts/ 目录（含子目录），自动生成 SEO 文件。
"""

import re
from pathlib import Path
from datetime import datetime

# ── 路径配置 ──────────────────────────────────────────────────
BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")
POSTS_DIR = BLOG_DIR / "posts"
SITEMAP_FILE = BLOG_DIR / "sitemap.xml"
ROBOTS_FILE = BLOG_DIR / "robots.txt"

# ── 域名 ─────────────────────────────────────────────────────
BASE_URL = "https://118.145.99.224"

# ── 主要页面配置（路径, 优先级, 更新频率） ────────────────────
MAIN_PAGES = [
    ("index.html",                          "1.0", "daily"),
    ("all-posts.html",                      "0.9", "weekly"),
    ("categories.html",                     "0.8", "weekly"),
    ("archive.html",                        "0.7", "weekly"),
    ("tags.html",                           "0.7", "weekly"),
    ("ghost-chatroom.html",                 "0.9", "weekly"),
    ("important-people.html",               "0.8", "weekly"),
    ("exploration-dashboard.html",          "0.8", "weekly"),
    ("series/kishiro-yukito/index.html",    "0.8", "weekly"),
]


def get_lastmod(filepath: Path) -> str:
    """获取文件最后修改时间 → YYYY-MM-DD"""
    return datetime.fromtimestamp(filepath.stat().st_mtime).strftime("%Y-%m-%d")


def extract_date_from_html(filepath: Path) -> str:
    """尝试从 HTML 内容提取发布日期，作为 lastmod 使用"""
    try:
        content = filepath.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return get_lastmod(filepath)

    # 方法1：📅 发布日期：2026年3月10日
    m = re.search(r"📅\s*发布日期[：:]\s*(\d{4})年(\d{1,2})月(\d{1,2})日", content)
    if m:
        y, mo, d = m.group(1), m.group(2).zfill(2), m.group(3).zfill(2)
        if 2024 <= int(y) <= 2030:
            return f"{y}-{mo}-{d}"

    # 方法2：发布于 2026年2月15日
    m = re.search(r"发布于\s*(\d{4})年(\d{1,2})月(\d{1,2})日", content)
    if m:
        y, mo, d = m.group(1), m.group(2).zfill(2), m.group(3).zfill(2)
        if 2024 <= int(y) <= 2030:
            return f"{y}-{mo}-{d}"

    # 方法3：meta description 中的 ISO 日期
    m = re.search(r'<meta\s+name="description"\s+content="(20(?:2[4-9]|[3-9]\d))-(\d{2})-(\d{2})', content, re.IGNORECASE)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # 方法4：正文中的中文日期
    m = re.search(r"(20(?:2[4-9]|[3-9]\d))年(\d{1,2})月(\d{1,2})日", content)
    if m:
        y, mo, d = m.group(1), m.group(2).zfill(2), m.group(3).zfill(2)
        return f"{y}-{mo}-{d}"

    # 方法5：正文中的 ISO 日期
    m = re.search(r"(20(?:2[4-9]|[3-9]\d))-(\d{2})-(\d{2})", content)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # fallback：文件修改时间
    return get_lastmod(filepath)


def generate_sitemap():
    """生成 sitemap.xml"""
    urls = []

    # 1. 主要页面
    for page, priority, changefreq in MAIN_PAGES:
        page_path = BLOG_DIR / page
        if page_path.exists():
            urls.append({
                "loc": f"{BASE_URL}/{page}",
                "lastmod": get_lastmod(page_path),
                "priority": priority,
                "changefreq": changefreq,
            })
            print(f"  ✅ 主页面: {page}")
        else:
            print(f"  ⚠️  跳过不存在的页面: {page}")

    # 2. 博客文章（递归扫描，支持子目录）
    html_files = sorted(POSTS_DIR.rglob("*.html"))
    for f in html_files:
        rel = f.relative_to(BLOG_DIR)
        lastmod = extract_date_from_html(f)
        urls.append({
            "loc": f"{BASE_URL}/{rel}",
            "lastmod": lastmod,
            "priority": "0.7",
            "changefreq": "monthly",
        })
        print(f"  ✅ 文章: {rel}")

    # 3. 构建 XML
    entries = []
    for u in urls:
        entries.append(f"""    <url>
        <loc>{u['loc']}</loc>
        <lastmod>{u['lastmod']}</lastmod>
        <changefreq>{u['changefreq']}</changefreq>
        <priority>{u['priority']}</priority>
    </url>""")

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- 自动生成于 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} -->
{chr(10).join(entries)}
</urlset>
"""
    return xml, len(urls)


def generate_robots():
    """生成 robots.txt"""
    today = datetime.now().strftime("%Y-%m-%d")
    return f"""# robots.txt for 阳子的博客
# 自动生成于 {today}

# 允许所有搜索引擎爬取
User-agent: *
Allow: /

# 禁止爬取的目录
Disallow: /memory/
Disallow: /yoko-blog-server/
Disallow: /daily-briefing/
Disallow: /ghost-chatroom-vue/
Disallow: /yoko-blog-hugo/
Disallow: /scripts/
Disallow: /agents/
Disallow: /.git

# 允许爬取的资源
Allow: /public/
Allow: /css/
Allow: /js/
Allow: /posts/
Allow: /ja/

# Sitemap位置
Sitemap: {BASE_URL}/sitemap.xml

# 爬取延迟（可选，为礼貌爬取）
Crawl-delay: 1
"""


def main():
    print("🗺️  正在生成 sitemap.xml ...")
    if not POSTS_DIR.exists():
        print(f"❌ 错误：文章目录不存在：{POSTS_DIR}")
        return

    # 生成 sitemap.xml
    sitemap_xml, url_count = generate_sitemap()
    SITEMAP_FILE.write_text(sitemap_xml, encoding="utf-8")
    print(f"\n✅ 成功生成：{SITEMAP_FILE}")
    print(f"   共 {url_count} 个 URL")

    # 生成 robots.txt
    print("\n🤖 正在生成 robots.txt ...")
    robots_txt = generate_robots()
    ROBOTS_FILE.write_text(robots_txt, encoding="utf-8")
    print(f"✅ 成功生成：{ROBOTS_FILE}")


if __name__ == "__main__":
    main()
