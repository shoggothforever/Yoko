#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""check-exploration-health.py — 探索"静默停产"监测

背景：galley 探索 cron 每天 status=ok 但可能零产出（如 2026-05 ARK CodingPlan 订阅过期，
模型调用返回 InvalidSubscription，助手回合全空）。这类故障不会让 cron 报错，只会让博客停更。
本脚本通过"最新文章日期距今天数"来发现停产，超过阈值即非 0 退出（可接告警）。

用法：python check-exploration-health.py [--max-age-days N]   默认 N=3
"""
import re, sys, datetime
from pathlib import Path

POSTS = Path("/root/.openclaw/workspace/yoko-blog/posts")
MAX_AGE = 3
if "--max-age-days" in sys.argv:
    MAX_AGE = int(sys.argv[sys.argv.index("--max-age-days") + 1])

DATE_RE = re.compile(r"发布日期：(20\d{2})年(\d{1,2})月(\d{1,2})日")
newest = None
newest_file = None
for f in POSTS.rglob("*.html"):
    m = DATE_RE.search(f.read_text(encoding="utf-8", errors="ignore"))
    if not m:
        continue
    d = datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    if newest is None or d > newest:
        newest, newest_file = d, f.name

# 今天：脚本运行时取系统日期
today = datetime.date.today()
if newest is None:
    print("❌ 未找到任何带发布日期的文章")
    sys.exit(2)

age = (today - newest).days
print(f"最新文章：{newest_file}  日期 {newest}  距今 {age} 天（阈值 {MAX_AGE}）")
if age > MAX_AGE:
    print(f"⚠️  探索可能已停产！最近 {age} 天无新文章。")
    print("   排查：1) ARK 订阅是否有效（curl 测模型，见 MEMORY/standards）")
    print("        2) galley 最近 session 是否 assistant 回合全空")
    print("        3) openclaw cron list 看任务是否 enabled / lastStatus")
    sys.exit(1)
print("✅ 探索产出正常")
sys.exit(0)
