#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""check-links.py — 全站可达内部链接连通性体检（基于文件系统，本地/云端/CI 通用）。

像浏览器那样从首页做可达性 DFS：从 index.html + 组件导航 + 文章数据 url 出发，
用 URL 语义（urljoin，自带把越根的 ../ clamp 到站点根）解析每个内部 <a href>，
映射到 yoko-blog 下的文件检查是否存在。只检查“点得到”的页面，忽略孤立目录。
不依赖 web 服务器。发现断链即以非 0 退出（便于 CI / 告警）。

用法：python check-links.py
"""
import re, sys
from pathlib import Path
from collections import deque, defaultdict
from urllib.parse import urljoin

BLOG = (Path(__file__).resolve().parents[2] / "yoko-blog").resolve()
SCRIPT_RE = re.compile(r"<(script|style)\b.*?</\1>", re.I | re.S)
A_RE = re.compile(r'<a\b[^>]*\bhref="([^"]+)"', re.I)


def internal(href):
    href = (href or "").strip()
    if not href:
        return None
    low = href.lower()
    if low.startswith(("http://", "https://", "mailto:", "tel:", "javascript:", "data:", "//")):
        return None
    if href.startswith("#"):
        return None
    return href


def url_to_file(urlpath):
    rel = urlpath.split("#")[0].split("?")[0].lstrip("/")
    if rel == "" or rel.endswith("/"):
        rel += "index.html"
    return BLOG / rel


# 种子：首页 + 组件导航(${rootPath}X → /X) + 文章数据 url(/url)
seeds = {"/index.html"}
for comp in ["js/header-component.js", "js/footer-component.js"]:
    p = BLOG / comp
    if p.exists():
        for m in re.findall(r'href="(?:\$\{rootPath\})?([^"]+)"', p.read_text(encoding="utf-8")):
            h = internal(m)
            if h:
                seeds.add("/" + h.lstrip("/"))
data = BLOG / "blog-posts-data.js"
if data.exists():
    for u in re.findall(r'url:\s*"([^"]+)"', data.read_text(encoding="utf-8")):
        seeds.add("/" + u.lstrip("/"))

visited = set()
src = defaultdict(set)
broken = {}
q = deque()
for s in seeds:
    clean = s.split("#")[0].split("?")[0]
    q.append(clean)
    src[clean].add("(种子)")

while q:
    path = q.popleft()
    if path in visited:
        continue
    visited.add(path)
    f = url_to_file(path)
    if not f.exists():
        broken[path] = True
        continue
    if f.suffix.lower() != ".html":
        continue  # 资源（feed.xml/图片等）存在即可，不解析
    text = SCRIPT_RE.sub("", f.read_text(encoding="utf-8", errors="ignore"))
    for href in A_RE.findall(text):
        h = internal(href)
        if not h:
            continue
        tgt = urljoin(path, h).split("#")[0].split("?")[0]
        if not tgt:
            continue
        src[tgt].add(path.lstrip("/") or "index.html")
        if tgt not in visited:
            q.append(tgt)

print(f"=== 可达链接体检：遍历 {len(visited)} 个内部路径 ===")
if not broken:
    print("✅ 没有断链（404）")
    sys.exit(0)
print(f"❌ 发现 {len(broken)} 个断链：")
for p in sorted(broken):
    print(f"  缺失: {p}")
    for s in sorted(src.get(p, []))[:8]:
        print(f"      ← {s}")
sys.exit(1)
