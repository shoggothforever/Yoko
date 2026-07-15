#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查每日博客 SLA，而不是相信调度器的 status=ok。

11:30 的成功条件是：仓库中存在当天文章，或存在格式完整的“不发布选题
报告”。同时保留文章年龄监控：连续两天没有发布文章时升级告警。
"""
import argparse
import datetime as dt
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
POSTS = ROOT / "yoko-blog" / "posts"
REPORTS = ROOT / "memory" / "daily-blog-reports"
DATE_RE = re.compile(r"发布日期：(20\d{2})年(\d{1,2})月(\d{1,2})日")


def article_dates():
    found = []
    for path in POSTS.rglob("*.html"):
        match = DATE_RE.search(path.read_text(encoding="utf-8", errors="ignore"))
        if match:
            date = dt.date(*(int(value) for value in match.groups()))
            found.append((date, path))
    return sorted(found, reverse=True)


def valid_report(path):
    if not path.exists():
        return False, "报告不存在"
    text = path.read_text(encoding="utf-8", errors="ignore")
    missing = [label for label in ("候选", "评分", "淘汰理由") if label not in text]
    if missing:
        return False, "报告缺少字段：" + "、".join(missing)
    return True, "报告包含候选、评分和淘汰理由"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="检查日期 YYYY-MM-DD，默认今天")
    parser.add_argument("--report-dir", type=Path, default=REPORTS)
    parser.add_argument("--max-age-days", type=int, default=1,
                        help="文章年龄大于此值时升级告警，默认 1（连续两天未发）")
    args = parser.parse_args()
    today = dt.date.fromisoformat(args.date) if args.date else dt.date.today()
    dates = article_dates()
    todays = [path for date, path in dates if date == today]
    newest = dates[0] if dates else None
    report = args.report_dir / f"{today.isoformat()}-topic-report.md"
    report_ok, report_detail = valid_report(report)

    if todays:
        print(f"✅ 今日文章存在：{todays[0].relative_to(ROOT)}")
        outcome_ok = True
    elif report_ok:
        print(f"✅ 今日选择不发布：{report.relative_to(ROOT)}（{report_detail}）")
        outcome_ok = True
    else:
        print(f"❌ 今日既无文章，也无合格的不发布报告：{report_detail}")
        outcome_ok = False

    if newest:
        age = (today - newest[0]).days
        print(f"最新文章：{newest[1].relative_to(ROOT)}，日期 {newest[0]}，距检查日 {age} 天")
        if age > args.max_age_days:
            print(f"🚨 升级告警：已连续至少 {age} 天未发布文章")
            return 2
    else:
        print("🚨 升级告警：未找到任何带发布日期的文章")
        return 2
    return 0 if outcome_ok else 1


if __name__ == "__main__":
    sys.exit(main())
