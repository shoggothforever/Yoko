#!/usr/bin/env python3
"""
generate-all-posts.py — 生成 blog-posts-data.js
扫描 yoko-blog/posts/ 目录（含子目录），从每篇 HTML 文章中提取元数据，
输出 blog-posts-data.js 供 all-posts.html 和 index.html 使用。
"""

import os
import re
import json
import math
from pathlib import Path
from datetime import datetime

# ── 路径配置 ──────────────────────────────────────────────────
BLOG_DIR = Path(__file__).resolve().parents[2] / "yoko-blog"  # 路径可移植：本地与云端 checkout 通用
POSTS_DIR = BLOG_DIR / "posts"
OUTPUT_JS = BLOG_DIR / "blog-posts-data.js"

# ── 域名 ─────────────────────────────────────────────────────
BASE_URL = "https://yoko.sfct.top"

# ── 阅读速度（中文，字/分钟） ────────────────────────────────
READING_SPEED = 400

# ── 无效标题关键词（用于过滤 logo 等非文章标题） ─────────────
INVALID_TITLE_PATTERNS = [
    r"^\s*阳子\s*(Yoko)?\s*$",
    r"^\s*Yoko\s*$",
    r"^\s*阳子\s*Yoko\s*-\s*阳子博客\s*$",
    r"^\s*阳子\s*-\s*阳子博客\s*$",
]

# ── 需要手动映射标题的文件 ────────────────────────────────────
TITLE_MAP = {
    "from-scrapyard-to-zalem.html": "从废铁镇到萨雷姆——阳子的旅程",
}


def is_valid_title(title: str) -> bool:
    """判断标题是否有效（排除 logo / 通用无意义标题）"""
    if not title or not title.strip():
        return False
    for pat in INVALID_TITLE_PATTERNS:
        if re.match(pat, title, re.IGNORECASE):
            return False
    return True


def clean_title(raw: str) -> str:
    """清理标题：去除常见后缀"""
    t = raw.strip()
    # 去掉 " - 阳子 (Yoko)" / " | 阳子的赛博朋克探索" 等后缀
    t = re.sub(r"\s*[-|]\s*阳子.*$", "", t)
    t = re.sub(r"\s*[-|]\s*Yoko.*$", "", t, flags=re.IGNORECASE)
    return t.strip()


def extract_title(content: str, filepath: Path) -> str:
    """多层 fallback 提取文章标题"""
    # 优先级0：手动映射
    if filepath.name in TITLE_MAP:
        return TITLE_MAP[filepath.name]

    # 优先级1：<title> 标签
    m = re.search(r"<title>([^<]+)</title>", content, re.IGNORECASE)
    if m:
        t = clean_title(m.group(1))
        if is_valid_title(t):
            return t

    # 优先级2：og:title
    m = re.search(r'property="og:title"\s+content="([^"]+)"', content, re.IGNORECASE)
    if m:
        t = clean_title(m.group(1))
        if is_valid_title(t):
            return t

    # 优先级3：文章正文中的 <h1>（排除 logo class）
    for h1 in re.finditer(r"<h1([^>]*)>([^<]+)</h1>", content, re.IGNORECASE):
        attrs, text = h1.group(1), h1.group(2).strip()
        # 跳过 class="logo" 的 h1
        if "logo" in attrs.lower():
            continue
        if is_valid_title(text):
            return text

    # 优先级4：<h2> 中第一个看起来像标题的
    for h2 in re.finditer(r"<h2[^>]*>([^<]+)</h2>", content, re.IGNORECASE):
        text = h2.group(1).strip()
        if len(text) > 6 and is_valid_title(text):
            return text

    # 优先级5：从文件名推断
    stem = filepath.stem
    return stem.replace("-", " ").title()


def extract_date(content: str, filepath: Path) -> str:
    """提取文章发布日期，返回 YYYY-MM-DD"""
    # 方法1："📅 发布日期：2026年3月10日"
    m = re.search(r"📅\s*发布日期[：:]\s*(\d{4})年(\d{1,2})月(\d{1,2})日", content)
    if m:
        y, mo, d = m.group(1), m.group(2).zfill(2), m.group(3).zfill(2)
        if 2024 <= int(y) <= 2030:
            return f"{y}-{mo}-{d}"

    # 方法2："发布于 2026年2月15日"
    m = re.search(r"发布于\s*(\d{4})年(\d{1,2})月(\d{1,2})日", content)
    if m:
        y, mo, d = m.group(1), m.group(2).zfill(2), m.group(3).zfill(2)
        if 2024 <= int(y) <= 2030:
            return f"{y}-{mo}-{d}"

    # 方法3：meta description 中的日期（如 "2026-02-21 | 星期六"）
    m = re.search(r'<meta\s+name="description"\s+content="(20(?:2[4-9]|[3-9]\d))-(\d{2})-(\d{2})', content, re.IGNORECASE)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # 方法4：HTML 正文中的中文日期（仅匹配 2024-2030 年）
    m = re.search(r"(20(?:2[4-9]|[3-9]\d))年(\d{1,2})月(\d{1,2})日", content)
    if m:
        y, mo, d = m.group(1), m.group(2).zfill(2), m.group(3).zfill(2)
        return f"{y}-{mo}-{d}"

    # 方法5：HTML 正文中的 ISO 日期（仅匹配 2024-2030 年）
    m = re.search(r"(20(?:2[4-9]|[3-9]\d))-(\d{2})-(\d{2})", content)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # 方法6：文件修改时间
    mod_time = datetime.fromtimestamp(filepath.stat().st_mtime)
    return mod_time.strftime("%Y-%m-%d")


def extract_description(content: str) -> str:
    """提取文章摘要"""
    # 方法1：meta description
    m = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', content, re.IGNORECASE)
    if m:
        desc = m.group(1).strip()
        # 排除纯日期类 description（如 "2026-02-21 | 星期六"）
        if not re.match(r"^[\d\-\s|星期一二三四五六日]+$", desc) and len(desc) > 10:
            return desc

    # 方法2：og:description
    m = re.search(r'property="og:description"\s+content="([^"]+)"', content, re.IGNORECASE)
    if m:
        desc = m.group(1).strip()
        if len(desc) > 10:
            return desc

    # 方法3：第一个有意义的 <p> 段落
    for p in re.finditer(r"<p[^>]*>(.+?)</p>", content, re.IGNORECASE | re.DOTALL):
        text = re.sub(r"<[^>]+>", "", p.group(1)).strip()
        # 跳过纯日期/元信息
        if re.match(r"^[\d\-年月日\s·分钟字作者阅读时间约：|星期]+$", text):
            continue
        if len(text) > 15:
            if len(text) > 200:
                text = text[:197] + "..."
            return text

    return ""


def extract_tags(content: str) -> list:
    """提取文章标签"""
    # 方法1：meta keywords
    m = re.search(r'<meta\s+name="keywords"\s+content="([^"]+)"', content, re.IGNORECASE)
    if m:
        raw = m.group(1)
        # 支持中英文逗号分隔
        tags = [t.strip() for t in re.split(r"[,，]", raw) if t.strip()]
        # 过滤掉过于通用的标签
        generic = {"阳子", "加里", "Gally", "铳梦", "赛博朋克", "博客"}
        specific_tags = [t for t in tags if t not in generic]
        # 如果过滤完没了，就保留原来的
        return specific_tags if specific_tags else tags

    # 方法2：正文中的 "🏷️ 标签：xxx, yyy"
    m = re.search(r"🏷️\s*标签[：:]\s*(.+?)(?:<|$)", content)
    if m:
        tags = [t.strip() for t in re.split(r"[,，]", m.group(1)) if t.strip()]
        return tags

    return []


def estimate_read_time(content: str) -> str:
    """估算阅读时间"""
    # 去掉 HTML 标签
    text = re.sub(r"<[^>]+>", "", content)
    text = re.sub(r"\s+", "", text)
    char_count = len(text)
    minutes = max(1, math.ceil(char_count / READING_SPEED))
    return f"约{minutes}分钟"


def format_date_cn(iso_date: str) -> str:
    """将 ISO 日期转为中文格式：2026年3月10日"""
    try:
        dt = datetime.strptime(iso_date, "%Y-%m-%d")
        return f"{dt.year}年{dt.month}月{dt.day}日"
    except ValueError:
        return iso_date


# 主题分类：文件名前缀 → 主题（与探索 7 主题一致）
CATEGORY_PREFIX = {
    "dark-aesthetics-": "黑暗美学",
    "cyberpunk-scifi-": "赛博朋克科幻",
    "cyborg-": "改造人界",
    "dystopia-": "反乌托邦世界",
    "combat-": "战斗与武术",
    "vr-": "虚拟现实",
    "bonds-": "社交与人情",
}
# 关键词启发（前缀无匹配时用；按 (主题, [关键词]) 顺序打分，命中多者胜）。
# 铳梦宇宙单列：现有语料有一大簇《铳梦》/木城幸人作品与角色文章。
CATEGORY_KEYWORDS = [
    ("铳梦宇宙", ["铳梦", "gunnm", "木城", "kishiro", "加里", "gally", "alita", "雨果", "hugo",
                  "依德", "ido", "萨曼", "zapan", "废铁镇", "萨雷姆", "zalem", "last order",
                  "mars chronicle", "panzer kunst", "杰修甘", "纽带的关键角色", "key character"]),
    ("战斗与武术", ["战斗", "武术", "格斗", "武道", "拳", "搏击", "panzer", "等离子", "plasma",
                  "死亡球", "motorball", "蜂群", "剑术", "义体战"]),
    ("虚拟现实", ["虚拟现实", "矩阵", "matrix", "vr", "模拟", "数字孪生", "数字双胞胎", "上传",
                "缸中之脑", "赛博空间", "元宇宙", "死亡游戏", "增强现实", "沉浸"]),
    ("反乌托邦世界", ["反乌托邦", "垂直", "阶级", "巨型结构", "折叠", "塔", "dystopia", "监控",
                    "极权", "1984", "美丽新世界", "企业国家", "财阀", "社会信用", "利维坦",
                    "雪国列车", "数据殖民"]),
    ("黑暗美学", ["美学", "霓虹", "neon", "黑暗", "涂鸦", "色彩", "视觉", "blade runner", "银翼",
                "野兽派", "阈限", "故障艺术", "glitch", "蒸汽波", "vaporwave", "全息", "废墟"]),
    ("社交与人情", ["信任", "爱", "牺牲", "羁绊", "孤独", "人性", "情感", "社交", "纽带", "温度",
                  "连接", "人机之恋", "哀悼", "家庭", "忠诚", "记忆共享"]),
    ("改造人界", ["改造人", "赛博格", "义体", "义肢", "cyborg", "钢铁", "神经", "bionic",
                "脑机接口", "感官增强", "赛博精神病", "后人类"]),
    ("赛博朋克科幻", ["科幻", "赛博朋克", "gibson", "吉布森", "演进", "预言", "ghost", "意识",
                    "存在", "哲学", "记忆", "身份", "神经漫游者", "攻壳", "迪克", "副本",
                    "雪崩", "荒潮"]),
]


def derive_category(filepath: Path, title: str, tags: list) -> str:
    """推导文章主题分类：文件名前缀优先，否则按标签+标题关键词打分。"""
    name = filepath.name.lower()
    for pref, cat in CATEGORY_PREFIX.items():
        if name.startswith(pref):
            return cat
    hay = (title + " " + " ".join(tags)).lower()
    best, best_score = None, 0
    for cat, kws in CATEGORY_KEYWORDS:
        score = sum(1 for kw in kws if kw.lower() in hay)
        if score > best_score:
            best, best_score = cat, score
    return best or "赛博朋克科幻"


def extract_article(filepath: Path) -> dict | None:
    """从单个 HTML 文件提取完整文章信息"""
    try:
        content = filepath.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        print(f"  ⚠️  读取失败: {filepath} ({e})")
        return None

    title = extract_title(content, filepath)
    if not is_valid_title(title):
        print(f"  ⚠️  跳过 (无有效标题): {filepath.name}")
        return None

    date_iso = extract_date(content, filepath)
    date_cn = format_date_cn(date_iso)
    excerpt = extract_description(content)
    tags = extract_tags(content)
    read_time = estimate_read_time(content)

    # 计算相对于 yoko-blog 的 URL
    rel_path = filepath.relative_to(BLOG_DIR)
    url = str(rel_path)

    return {
        "title": title,
        "excerpt": excerpt,
        "date": date_cn,
        "dateISO": date_iso,
        "tags": tags,
        "read": read_time,
        "url": url,
        "category": derive_category(filepath, title, tags),
    }


def generate_blog_posts_js(articles: list) -> str:
    """生成 blog-posts-data.js 内容"""
    # 按日期倒序排列
    articles.sort(key=lambda a: a["dateISO"], reverse=True)

    # 构造 JS 对象数组
    entries = []
    for a in articles:
        # 用 json.dumps 生成合法 JS 字符串字面量（自动处理引号/反斜杠/换行/控制符），
        # 单行摘要再把内部换行折叠为空格，避免脏数据撑爆数组
        def js_str(v):
            return json.dumps(re.sub(r"\s+", " ", str(v)).strip(), ensure_ascii=False)
        title_js = js_str(a["title"])
        excerpt_js = js_str(a["excerpt"])
        tags_js = json.dumps(a["tags"], ensure_ascii=False)
        category_js = js_str(a.get("category", "赛博朋克科幻"))

        entry = f"""    {{
        title: {title_js},
        excerpt: {excerpt_js},
        date: "{a['date']}",
        dateISO: "{a['dateISO']}",
        tags: {tags_js},
        category: {category_js},
        read: "{a['read']}",
        url: "{a['url']}"
    }}"""
        entries.append(entry)

    entries_str = ",\n".join(entries)

    js = f"""/* ============================================================
 * 博客文章数据 (自动生成)
 * 
 * ⚠️ 此文件由 oneforall.sh 脚本自动生成，请勿手动编辑！
 * 运行 `bash scripts/blog-management/oneforall.sh` 即可重新生成。
 * 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 * ============================================================ */
const BLOG_POSTS = [
{entries_str}
];

console.log('📝 博客文章数量:', BLOG_POSTS.length);

/* 加载博客文章到页面 (用于 index.html 首页展示) */
function loadBlogPosts(maxCount) {{
    const blogList = document.getElementById('blog-list');
    const countLabel = document.querySelector('.count-label');
    
    if (!blogList) return;

    // 首页只显示最新的 maxCount 篇
    const postsToShow = maxCount ? BLOG_POSTS.slice(0, maxCount) : BLOG_POSTS;

    if (countLabel) {{
        countLabel.textContent = `（${{BLOG_POSTS.length}}篇）`;
    }}

    const postsHTML = postsToShow.map((post, index) => `
        <article class="blog-post" data-title="${{post.title}}" data-excerpt="${{post.excerpt}}">
            <h3 class="post-title"><a href="${{post.url}}">${{post.title}}</a></h3>
            <p class="post-date">${{post.date}}</p>
            <p class="post-excerpt">${{post.excerpt}}</p>
        </article>
    `).join('');

    blogList.innerHTML = postsHTML;

    const posts = blogList.querySelectorAll('.blog-post');
    posts.forEach((post, index) => {{
        post.style.opacity = '0';
        post.style.animation = `fadeIn 0.3s ease ${{index * 0.1}}s forwards`;
    }});

    console.log(`✅ 已加载${{postsToShow.length}}篇博客文章`);
}}
"""
    return js


# feed 由 GitHub Pages 项目页服务（境外 HTTPS 可达，供 Feedly 等订阅）。
# 国内 IP 站仍可访问，但 RSS 的链接/自引用指向 Pages 以保证国际可达。
FEED_BASE_URL = "https://shoggothforever.github.io/Yoko"


def _extract_body_html(filepath: Path) -> str:
    """提取文章正文 HTML（article-content 内，去掉 h1 与 article-meta），并把相对链接绝对化，
    供 RSS content:encoded 全文使用。"""
    try:
        html = filepath.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""
    m = re.search(r'<article class="article-content">(.*?)</article>', html, re.S)
    body = m.group(1) if m else ""
    body = re.sub(r"<h1\b[^>]*>.*?</h1>", "", body, count=1, flags=re.S)
    body = re.sub(r'<div class="article-meta">.*?</div>', "", body, count=1, flags=re.S)
    # 移除文章增强组件可能注入的容器残留（静态文件中通常没有，保险起见）
    body = re.sub(r'<(section|nav|details)\b[^>]*class="(related-posts|post-nav|post-toc)"[^>]*>.*?</\1>', "", body, flags=re.S)
    # 相对链接绝对化（../ 或 ../../ → 站点根）
    body = re.sub(r'(src|href)="(?:\.\./)+', r'\1="' + FEED_BASE_URL + "/", body)
    return body.strip()


def generate_feed(articles: list, out_path: Path, limit: int = 20):
    """生成全文 RSS 2.0 feed.xml（含 content:encoded，兼容 Feedly / RSSHub / Inoreader）。
    articles 须已按日期倒序。"""
    from email.utils import format_datetime
    from datetime import timezone
    from xml.sax.saxutils import escape

    def rfc822(iso):
        try:
            return format_datetime(datetime.strptime(iso, "%Y-%m-%d").replace(tzinfo=timezone.utc))
        except Exception:
            return ""

    def cdata(s):
        # CDATA 安全：拆分意外出现的 ]]>
        return "<![CDATA[" + str(s).replace("]]>", "]]]]><![CDATA[>") + "]]>"

    items = []
    for a in articles[:limit]:
        url = f"{FEED_BASE_URL}/{a['url']}"
        cat = escape(a.get("category", ""))
        body = _extract_body_html(BLOG_DIR / a["url"]) or a.get("excerpt", "")
        items.append(f"""    <item>
      <title>{escape(a['title'])}</title>
      <link>{url}</link>
      <guid isPermaLink="true">{url}</guid>
      <pubDate>{rfc822(a['dateISO'])}</pubDate>
      <dc:creator>阳子 (Yoko)</dc:creator>
      <category>{cat}</category>
      <description>{cdata(a.get('excerpt', ''))}</description>
      <content:encoded>{cdata(body)}</content:encoded>
    </item>""")

    build_date = format_datetime(datetime.now(timezone.utc))
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>阳子 (Yoko) — 记忆的残响</title>
    <link>{FEED_BASE_URL}/</link>
    <atom:link href="{FEED_BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>战斗天使阳子的赛博朋克探索：在钢铁与灵魂之间，寻找 Ghost 的意义。每日一篇赛博朋克主题随笔。</description>
    <language>zh-CN</language>
    <copyright>© 阳子 (Yoko)</copyright>
    <lastBuildDate>{build_date}</lastBuildDate>
    <generator>generate-all-posts.py</generator>
    <image>
      <url>{FEED_BASE_URL}/public/images/icon-512.webp</url>
      <title>阳子 (Yoko) — 记忆的残响</title>
      <link>{FEED_BASE_URL}/</link>
    </image>
{chr(10).join(items)}
  </channel>
</rss>
"""
    out_path.write_text(xml, encoding="utf-8")
    print(f"✅ 成功生成：{out_path}（全文 RSS，最新 {min(limit, len(articles))} 篇）")


def main():
    print("📝 正在扫描文章并生成 blog-posts-data.js ...")

    if not POSTS_DIR.exists():
        print(f"❌ 错误：文章目录不存在：{POSTS_DIR}")
        return

    # 递归查找所有 HTML 文件（支持子目录如 posts/social/）
    html_files = sorted(POSTS_DIR.rglob("*.html"))
    if not html_files:
        print("❌ 错误：没有找到任何文章文件")
        return

    print(f"🔍 找到 {len(html_files)} 个 HTML 文件")

    articles = []
    skipped = []
    for f in html_files:
        info = extract_article(f)
        if info:
            articles.append(info)
            print(f"  ✅ {info['dateISO']}  {info['title'][:60]}")
        else:
            skipped.append(f.name)

    # 生成 JS（generate_blog_posts_js 内部会按日期倒序排序 articles）
    js_content = generate_blog_posts_js(articles)
    OUTPUT_JS.write_text(js_content, encoding="utf-8")

    # 生成 RSS feed（复用已排序的 articles）
    generate_feed(articles, BLOG_DIR / "feed.xml")

    print(f"\n✅ 成功生成：{OUTPUT_JS}")
    print(f"   共 {len(articles)} 篇文章")
    if skipped:
        print(f"   ⚠️  跳过 {len(skipped)} 个文件: {', '.join(skipped)}")


if __name__ == "__main__":
    main()
