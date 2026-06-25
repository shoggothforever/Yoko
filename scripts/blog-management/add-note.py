#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""add-note.py — 追加一条「探索札记」（微博式短记录）并重生成 notes-data.js。

源数据：yoko-blog/notes/notes.json（时间正序列表）
产出：  yoko-blog/notes-data.js（供 notes.html 渲染，前端倒序展示）

用法：
  python add-note.py --text "正文(可含轻量HTML如<em>/<strong>)" [--theme "主题"] [--source "作品名"]
路径可移植（本地与云端 checkout 通用）。
"""
import json, argparse, datetime, uuid
from pathlib import Path

BLOG = Path(__file__).resolve().parents[2] / "yoko-blog"
STORE = BLOG / "notes" / "notes.json"
OUT = BLOG / "notes-data.js"


def cn_dt(dt):
    return f"{dt.year}年{dt.month}月{dt.day}日 {dt.strftime('%H:%M')}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", help="札记正文（与 --text-file 二选一）")
    ap.add_argument("--text-file", dest="text_file", help="从文件读取正文（推荐，避开 shell 引号问题）")
    ap.add_argument("--theme", default="", help="主题（可选）")
    ap.add_argument("--source", default="", help="涉及的真实作品（可选）")
    a = ap.parse_args()
    if a.text_file:
        a.text = Path(a.text_file).read_text(encoding="utf-8")
    if not a.text or not a.text.strip():
        ap.error("需要 --text 或 --text-file 提供非空正文")

    STORE.parent.mkdir(parents=True, exist_ok=True)
    notes = json.loads(STORE.read_text(encoding="utf-8")) if STORE.exists() else []

    now = datetime.datetime.now()
    notes.append({
        "id": uuid.uuid4().hex[:12],
        "datetime": now.isoformat(timespec="minutes"),
        "date": cn_dt(now),
        "theme": a.theme.strip(),
        "source": a.source.strip(),
        "text": a.text.strip(),
    })

    STORE.write_text(json.dumps(notes, ensure_ascii=False, indent=2), encoding="utf-8")
    arr = json.dumps(notes, ensure_ascii=False, indent=2)
    OUT.write_text(
        "/* 探索札记数据（自动生成：scripts/blog-management/add-note.py）。请勿手改。 */\n"
        f"const YOKO_NOTES = {arr};\n",
        encoding="utf-8")
    print(f"✅ 已添加札记（现 {len(notes)} 条）：{a.text[:46]}")


if __name__ == "__main__":
    main()
