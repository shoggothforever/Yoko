#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""upgrade-posts.py — 一次性迁移现有文章到升级后模板（字符串级手术，最小 diff）

对 posts/**/*.html：
  1. 外部化 CSS：若 <head> 内联了标准模板 CSS（含标记串），删除该 <style> 块，
     并补 <link ... css/blog-article-template.css>（沿用同前缀）。带独特内联样式的
     早期文章（无标记）保持原样不动。
  2. 注入增强脚本：在 footer-component 之前加入 blog-posts-data.js + article-enhancements.js。

幂等：已迁移的文章不会重复改。用法：python upgrade-posts.py [--dry-run]
"""
import os, re, sys
from pathlib import Path

POSTS = Path(__file__).resolve().parents[2] / "yoko-blog" / "posts"
DRY = "--dry-run" in sys.argv
MARKER = "博客文章标准内联CSS模板"

stats = {"css_externalized": 0, "css_kept_custom": 0, "scripts_injected": 0, "unchanged": 0}

for f in sorted(POSTS.rglob("*.html")):
    text = f.read_text(encoding="utf-8", errors="replace")
    orig = text

    # 1. 外部化标准内联 CSS（仅当含标记串）
    if MARKER in text:
        # 删注释行 + 标记 <style> 块
        text = re.sub(r"[ \t]*<!-- 文章内联样式[^\n]*-->\n", "", text)
        text = re.sub(r"[ \t]*<style>\s*\n\s*/\* " + re.escape(MARKER) + r".*?</style>\n?",
                      "", text, flags=re.S)
        # 补模板 CSS 外链（沿用 cyberpunk-effects 的前缀）
        if "css/blog-article-template.css" not in text:
            m = re.search(r'<link rel="stylesheet" href="([^"]*?)css/cyberpunk-effects\.css">', text)
            if m:
                pref = m.group(1)
                text = text.replace(
                    m.group(0),
                    m.group(0) + f'\n    <link rel="stylesheet" href="{pref}css/blog-article-template.css">',
                    1)
        stats["css_externalized"] += 1
    elif "<style>" in text:
        stats["css_kept_custom"] += 1

    # 2. 注入增强脚本（在 footer-component 之前）
    if "article-enhancements.js" not in text:
        m = re.search(r'<script src="([^"]*?)js/footer-component\.js"[^>]*></script>', text)
        if m:
            pref = m.group(1)
            inject = (f'<script src="{pref}blog-posts-data.js"></script>\n'
                      f'    <script src="{pref}js/article-enhancements.js" data-auto-inject="true"></script>\n'
                      f'    {m.group(0)}')
            text = text.replace(m.group(0), inject, 1)
            stats["scripts_injected"] += 1

    if text != orig:
        if not DRY:
            f.write_text(text, encoding="utf-8")
            os.chmod(f, 0o644)
    else:
        stats["unchanged"] += 1

mode = "DRY-RUN" if DRY else "APPLIED"
print(f"=== upgrade-posts [{mode}] ===")
print(f"  CSS 外部化(标准模板): {stats['css_externalized']}")
print(f"  保留自定义内联样式:   {stats['css_kept_custom']}")
print(f"  注入增强脚本:         {stats['scripts_injected']}")
print(f"  未改动:               {stats['unchanged']}")
