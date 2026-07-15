#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
normalize-posts.py — 统一 yoko-blog 文章模板（修复"风格漂移"）

把不合规文章重新套用满血期标准模板，**只动结构/样式 + 补全缺失元数据，不改正文**：
  - 组件化 header/footer（删除手写 <header>/<footer>/死标签 <header-component>）
  - 正确的 CSS 引用：style.min.css + css/cyberpunk-effects.css + 内联 blog-article-template.css
  - 标准 <article class="article-content"> + <div class="article-meta">（5 字段）
  - 完整 SEO / canonical / OG / Twitter，统一指向 IP 域 https://118.145.99.224/
  - 按子目录深度自动修正相对路径（posts/ → ../，posts/x/ → ../../）
  - 文件权限 644

已经合规的文章会被跳过（保留其原有的丰富内联样式，不回退）。

用法：
  python normalize-posts.py            # dry-run：审计并分类，不改文件
  python normalize-posts.py --apply    # 应用修复
  python normalize-posts.py --apply --force-all   # 连合规文章也重写（一般不用）
"""
import os, re, sys, html as htmllib
from pathlib import Path
from bs4 import BeautifulSoup, Comment

ROOT = Path(__file__).resolve().parents[2] / "yoko-blog"
POSTS = ROOT / "posts"
BASE_URL = "https://118.145.99.224"
AUTHOR = "阳子"
DEFAULT_KEYWORDS = "阳子, 加里, Gally, 铳梦, 赛博朋克, 改造人, 博客"
APPLY = "--apply" in sys.argv
FORCE_ALL = "--force-all" in sys.argv
AUDIT = "--audit" in sys.argv

TEMPLATE_CSS = (ROOT / "css" / "blog-article-template.css").read_text(encoding="utf-8")

MONTHS_RE = re.compile(r"(20\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日")
ISO_RE = re.compile(r"(20\d{2})-(\d{1,2})-(\d{1,2})")
FNAME_DATE_RE = re.compile(r"(20\d{2})-(\d{1,2})-(\d{1,2})")


def cn_date(y, m, d):
    return f"{int(y)}年{int(m)}月{int(d)}日"


def extract_date(meta_text, fname):
    m = MONTHS_RE.search(meta_text)
    if m:
        return cn_date(*m.groups())
    m = ISO_RE.search(meta_text)
    if m:
        return cn_date(*m.groups())
    m = FNAME_DATE_RE.search(fname)
    if m:
        return cn_date(*m.groups())
    return None


def extract_field(meta_text, label_chars):
    """从元数据文本里抓 '标签：xxx' / '阅读时间：约x分钟' 这类字段。
    在任意 emoji 或字段分隔符处截断，避免窜入相邻字段（老文章用 📊/✍️ 等不同 emoji）。"""
    m = re.search(label_chars + r"[：:]\s*([^\n|·📅⏱️📖👤🏷📊✍📝🕐💬⌛️]+)", meta_text)
    if not m:
        return None
    val = re.sub(r"\s+", " ", m.group(1)).strip(" ·|—-")
    return val or None


def is_compliant(soup):
    head = soup.head
    if not head:
        return False
    scripts = [s.get("src", "") for s in head.find_all("script")]
    has_h = any("header-component.js" in s for s in scripts)
    has_f = any("footer-component.js" in s for s in (s2.get("src", "") for s2 in soup.find_all("script")))
    has_article = soup.select_one("article.article-content") is not None
    has_min = any("style.min.css" in (l.get("href", "")) for l in soup.find_all("link"))
    # 手写 header/footer（组件之外的真实标签）视为不合规
    manual_header = soup.body and soup.body.find("header") is not None
    manual_footer = soup.body and soup.body.find("footer") is not None
    return has_h and has_f and has_article and has_min and not manual_header and not manual_footer


def depth_prefix(path: Path):
    rel = path.relative_to(POSTS)
    extra = len(rel.parts) - 1   # 0 for posts/x.html, 1 for posts/sub/x.html
    return "../" * (1 + extra)


def clean_title(raw):
    if not raw:
        return None
    # 去掉站点后缀 " | 阳子的赛博世界" / " | 阳子的xxx" / " - xxx"
    raw = re.split(r"\s*[|｜]\s*", raw)[0]
    return raw.strip()


def extract_body(soup):
    """返回正文 HTML（保留原内容），剥离 header/footer/nav/h1/meta/脚本等外壳。"""
    body = soup.body or soup
    # 优先级：article.article-content > main.post-content > main > div.post-content > body
    src = (soup.select_one("article.article-content")
           or soup.select_one("main.post-content")
           or soup.select_one("main.article-content")
           or soup.select_one("main")
           or soup.select_one("div.post-content")
           or body)

    # 删除外壳元素
    for sel in ["header", "footer", "nav", "header-component", "footer-component", "script"]:
        for t in src.find_all(sel):
            t.decompose()
    for b in src.find_all("button"):
        if (b.get("id") == "scroll-top") or ("scroll-top" in " ".join(b.get("class", []))):
            b.decompose()
    # 删除标题 h1（移到模板里）
    h1 = src.find("h1")
    if h1:
        h1.decompose()
    # 删除已有 meta 块
    for sel in ["div.article-meta", "div.post-meta", "p.post-meta", "div.post-header"]:
        for t in src.find_all(re.compile(".*")):
            pass
    for t in src.select(".article-meta, .post-meta"):
        t.decompose()
    # post-header 容器：保留内部非标题内容（一般已空）
    for ph in src.select(".post-header"):
        ph.unwrap()
    # 解包正文里残留的结构性包裹（post-content / 嵌套 article|main），只保留其子内容
    for w in src.select(".post-content"):
        w.unwrap()
    for w in src.find_all(["article", "main", "section"]):
        if w is not src:
            w.unwrap()
    # 注释清理
    for c in src.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()

    # 取 src 的内部 HTML
    inner = "".join(str(c) for c in src.contents).strip()
    return inner


def build_meta_block(date, read, words, tags):
    lines = [f"                    <p>📅 发布日期：{date or '—'}</p>",
             f"                    <p>⏱️ 阅读时间：{read}</p>",
             f"                    <p>📖 字数：{words}</p>",
             f"                    <p>👤 作者：{AUTHOR}</p>"]
    if tags:
        lines.append(f"                    <p>🏷️ 标签：{tags}</p>")
    return "\n".join(lines)


def render(path, title, desc, date, read, words, tags, body_html):
    pref = depth_prefix(path)
    rel = path.relative_to(POSTS).as_posix()
    url = f"{BASE_URL}/posts/{rel}"
    desc_attr = htmllib.escape(desc or title)
    title_attr = htmllib.escape(title)
    meta_block = build_meta_block(date, read, words, tags)
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{title_attr}</title>
    <meta name="description" content="{desc_attr}">
    <meta name="keywords" content="{DEFAULT_KEYWORDS}">
    <meta name="author" content="{AUTHOR} (Yoko)">
    <meta name="robots" content="index, follow">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="{title_attr}">
    <meta property="og:description" content="{desc_attr}">
    <meta property="og:url" content="{url}">
    <meta property="og:image" content="{BASE_URL}/public/images/加里.webp">
    <meta property="og:locale" content="zh_CN">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title_attr}">
    <meta name="twitter:description" content="{desc_attr}">
    <meta name="twitter:image" content="{BASE_URL}/public/images/加里.webp">

    <!-- Canonical -->
    <link rel="canonical" href="{url}">

    <!-- CSS 样式表 -->
    <link rel="stylesheet" href="{pref}style.min.css">
    <link rel="stylesheet" href="{pref}css/cyberpunk-effects.css">
    <link rel="stylesheet" href="{pref}css/blog-article-template.css">

    <!-- 标准导航栏组件（自动注入） -->
    <script src="{pref}js/header-component.js" data-auto-inject="true"></script>
</head>

<body>
    <!-- 导航栏（自动注入） -->

    <main>
        <div class="container">
            <article class="article-content">
                <h1>{title_attr}</h1>
                <div class="article-meta">
{meta_block}
                </div>

{body_html}
            </article>
        </div>
    </main>

    <!-- 文章增强：上一篇/下一篇 + 相关文章 + 目录（读 blog-posts-data.js 客户端计算） -->
    <script src="{pref}blog-posts-data.js"></script>
    <script src="{pref}js/article-enhancements.js" data-auto-inject="true"></script>

    <!-- 页脚组件（自动注入） -->
    <script src="{pref}js/footer-component.js" data-auto-inject="true"></script>
</body>
</html>
"""


def first_paragraph_text(body_html):
    s = BeautifulSoup(body_html, "html.parser")
    for p in s.find_all(["p", "blockquote"]):
        txt = p.get_text(strip=True)
        if len(txt) > 20:
            return txt
    return s.get_text(strip=True)[:200]


def text_len(body_html):
    return len(re.sub(r"\s+", "", BeautifulSoup(body_html, "html.parser").get_text()))


def process(path: Path):
    raw = path.read_text(encoding="utf-8", errors="replace")
    soup = BeautifulSoup(raw, "html.parser")
    compliant = is_compliant(soup)
    if compliant and not FORCE_ALL:
        return ("skip-compliant", None)

    title = clean_title(soup.title.string if soup.title and soup.title.string else None)
    if not title:
        h1 = soup.find("h1")
        title = clean_title(h1.get_text(strip=True)) if h1 else path.stem

    # 元数据
    meta_text = ""
    for sel in [".article-meta", ".post-meta"]:
        el = soup.select_one(sel)
        if el:
            meta_text = el.get_text(" ", strip=True)
            break
    date = extract_date(meta_text, path.name)
    if not date:
        # 元数据/文件名都没有日期 → 用文件 mtime 兜底（近似发布日）
        import datetime
        mt = datetime.date.fromtimestamp(path.stat().st_mtime)
        date = cn_date(mt.year, mt.month, mt.day)
    tags = extract_field(meta_text, "标签") or extract_field(meta_text, "tags")
    read = extract_field(meta_text, "阅读时间")
    if read:
        read = re.sub(r"约\s*(\d+)\s*分钟", r"约\1分钟", read)

    body_html = extract_body(soup)
    words = text_len(body_html)
    if not read:
        read = f"约{max(1, round(words/400))}分钟"
    words_field = f"约{round(words/100)*100}字" if words >= 100 else f"约{words}字"

    # description
    desc_el = soup.find("meta", attrs={"name": "description"})
    desc = desc_el.get("content").strip() if desc_el and desc_el.get("content") else None
    if not desc:
        desc = first_paragraph_text(body_html)[:120]

    out = render(path, title, desc, date, read, words_field, tags, body_html)
    if APPLY:
        path.write_text(out, encoding="utf-8")
        os.chmod(path, 0o644)
    return ("fixed", {"title": title, "date": date, "tags": tags, "read": read, "words": words_field, "depth": depth_prefix(path)})


def audit():
    """结构合规检查：不写文件，列出违规项，全部合规 exit 0，否则 exit 1。"""
    files = sorted(POSTS.rglob("*.html"))
    violations = []
    for f in files:
        raw = f.read_text(encoding="utf-8", errors="replace")
        soup = BeautifulSoup(raw, "html.parser")
        problems = []
        scripts = [s.get("src", "") for s in soup.find_all("script")]
        links = [l.get("href", "") for l in soup.find_all("link")]
        if not any("header-component.js" in s for s in scripts): problems.append("无header组件")
        if not any("footer-component.js" in s for s in scripts): problems.append("无footer组件")
        if not any("style.min.css" in s for s in links): problems.append("无style.min.css")
        if not any("cyberpunk-effects.css" in s for s in links): problems.append("无cyberpunk-effects.css")
        if not soup.select_one("article.article-content"): problems.append("无article.article-content")
        if not soup.select_one(".article-meta"): problems.append("无article-meta")
        if soup.body and soup.body.find("header"): problems.append("残留手写<header>")
        if soup.body and soup.body.find("footer"): problems.append("残留手写<footer>")
        if any(re.search(r'href="(/|\.\./|\.\./\.\./)css/style\.css"', s) for s in links): problems.append("引用不存在的css/style.css")
        if "yoko.sfct.top" in raw: problems.append("canonical域名不一致(应为IP)")
        if "博客文章标准内联CSS模板" in raw: problems.append("仍内联标准模板CSS(应外链)")
        if not any("article-enhancements.js" in s for s in scripts): problems.append("缺文章增强脚本")
        if (f.stat().st_mode & 0o777) != 0o644: problems.append(f"权限非644({oct(f.stat().st_mode & 0o777)})")
        if problems:
            violations.append((f.relative_to(POSTS), problems))
    total = len(files)
    print(f"\n=== 博客合规审计：{total} 篇文章 ===")
    if not violations:
        print("✅ 全部合规")
        return 0
    print(f"❌ {len(violations)} 篇不合规：")
    for rel, probs in violations:
        print(f"  {rel}: {', '.join(probs)}")
    return 1


def main():
    if AUDIT:
        sys.exit(audit())
    files = sorted(POSTS.rglob("*.html"))
    stats = {"fixed": [], "skip-compliant": []}
    for f in files:
        try:
            status, info = process(f)
        except Exception as e:
            print(f"  !! ERROR {f.relative_to(POSTS)}: {e}")
            continue
        stats.setdefault(status, []).append((f, info))
    mode = "APPLIED" if APPLY else "DRY-RUN (加 --apply 才会写入)"
    print(f"\n=== normalize-posts [{mode}] ===")
    print(f"合规跳过: {len(stats['skip-compliant'])}    需修复: {len(stats['fixed'])}\n")
    for f, info in stats["fixed"]:
        rel = f.relative_to(POSTS)
        print(f"  FIX  {str(rel):55s} date={info['date']}  read={info['read']}  tags={'有' if info['tags'] else '无'}  ({info['depth']})")
    print("\n合规跳过的文章:")
    print("  " + ", ".join(sorted(str(f.relative_to(POSTS)) for f, _ in stats["skip-compliant"])))


if __name__ == "__main__":
    main()
