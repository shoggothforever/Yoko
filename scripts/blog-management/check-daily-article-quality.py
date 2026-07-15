#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""对指定日期的新文章执行无第三方依赖的机械发布门禁。"""
import argparse
import datetime as dt
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
POSTS = ROOT / "yoko-blog" / "posts"
DATE_RE = re.compile(r"发布日期：(20\d{2})年(\d{1,2})月(\d{1,2})日")


class ArticleParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_article = False
        self.text = []
        self.has_article = False
        self.has_header = False
        self.has_footer = False
        self.has_enhancements = False
        self.has_description = False
        self.has_canonical = False
        self.heading = None
        self.in_source_section = False
        self.source_text = []
        self.source_domains = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set(attrs.get("class", "").split())
        if tag == "article" and "article-content" in classes:
            self.has_article = True
            self.in_article = True
        if tag == "script":
            src = attrs.get("src", "")
            self.has_header |= "header-component.js" in src
            self.has_footer |= "footer-component.js" in src
            self.has_enhancements |= "article-enhancements.js" in src
        elif tag == "meta" and attrs.get("name") == "description" and attrs.get("content"):
            self.has_description = True
        elif tag == "link" and "canonical" in attrs.get("rel", "").split() and attrs.get("href"):
            self.has_canonical = True
        if tag in {"h2", "h3", "h4"}:
            self.heading = []
            if self.in_source_section:
                self.in_source_section = False
        elif tag == "a" and self.in_source_section:
            href = attrs.get("href", "")
            if href.startswith(("http://", "https://")):
                domain = urlparse(href).hostname
                if domain:
                    self.source_domains.add(domain.lower())

    def handle_endtag(self, tag):
        if tag in {"h2", "h3", "h4"} and self.heading is not None:
            if re.search(r"来源|参考", "".join(self.heading)):
                self.in_source_section = True
            self.heading = None
        if tag == "article":
            self.in_article = False

    def handle_data(self, data):
        if self.in_article:
            self.text.append(data)
        if self.heading is not None:
            self.heading.append(data)
        if self.in_source_section:
            self.source_text.append(data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="YYYY-MM-DD，默认今天")
    parser.add_argument("--file", type=Path, help="只检查一个文件")
    args = parser.parse_args()
    target = dt.date.fromisoformat(args.date) if args.date else dt.date.today()
    paths = [args.file.resolve()] if args.file else sorted(POSTS.rglob("*.html"))
    matched, failures = [], []

    for path in paths:
        raw = path.read_text(encoding="utf-8", errors="replace")
        match = DATE_RE.search(raw)
        if not match or dt.date(*(int(v) for v in match.groups())) != target:
            continue
        matched.append(path)
        doc = ArticleParser()
        doc.feed(raw)
        text = " ".join(doc.text)
        char_count = len(re.sub(r"\s+", "", text))
        checks = {
            "标准 article 结构": doc.has_article,
            "header 组件": doc.has_header,
            "footer 组件": doc.has_footer,
            "文章增强脚本": doc.has_enhancements,
            "SEO description": doc.has_description,
            "canonical": doc.has_canonical,
            "正文 1800–3200 字符": 1800 <= char_count <= 3200,
            "文件权限 644": (os.stat(path).st_mode & 0o777) == 0o644,
            "中心问题": "？" in text or "?" in text,
            "反方或阴影面": any(w in text for w in ("但是", "然而", "反过来", "阴影", "代价", "反方")),
            "认识变化": any(w in text for w in ("我开始", "我意识到", "我原以为", "现在我", "我改变")),
            "至少 3 个独立来源": len(doc.source_domains) >= 3,
            "来源说明支持的事实": bool(re.search(r"支持|用于核验|证实|说明", " ".join(doc.source_text))),
            "无未替换占位符": not re.search(r"\$\{[^}]+\}|\b(TODO|TBD)\b", raw),
            "无明显密钥材料": not re.search(r"-----BEGIN [A-Z ]+PRIVATE KEY-----|AKIA[0-9A-Z]{16}", raw),
        }
        for name, ok in checks.items():
            if not ok:
                failures.append(
                    f"{path.relative_to(ROOT)}: {name}（正文字符 {char_count}，来源域名 {len(doc.source_domains)}）"
                )

    if not matched:
        print(f"❌ 未找到发布日期为 {target} 的文章")
        return 2
    if failures:
        print("❌ 每日文章质量门禁失败：")
        for item in failures:
            print(f"  - {item}")
        return 1
    print(f"✅ {len(matched)} 篇今日文章通过机械质量门禁")
    return 0


if __name__ == "__main__":
    sys.exit(main())
