#!/usr/bin/env python3
"""
修正博客文章的字数统计
统计纯文本内容中可见字符的数量（排除空格、换行、制表符）
"""

import os
import re
import html

def count_visible_chars(html_content):
    """
    统计纯文本中可见字符的数量

    方法：
    1. 移除 <script> 和 <style> 标签及其内容
    2. 移除所有 HTML 标签
    3. 解码 HTML 实体（如 &nbsp; 等）
    4. 移除空白字符（空格、换行、制表符）
    5. 统计剩余的可见字符
    """
    # 移除 <script> 标签及其内容
    content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

    # 移除 <style> 标签及其内容
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)

    # 移除所有 HTML 标签
    content = re.sub(r'<[^>]+>', '', content)

    # 解码 HTML 实体
    content = html.unescape(content)

    # 移除空白字符（空格、换行、制表符）
    content = re.sub(r'\s+', '', content)

    # 统计可见字符
    return len(content)

def fix_article_wordcount(file_path, dry_run=False):
    """修正单篇文章的字数统计"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 计算实际字数
        actual_chars = count_visible_chars(content)

        # 查找当前字数统计
        pattern = r'📖 字数：约([0-9]+)字'
        match = re.search(pattern, content)

        if not match:
            print(f"❌ {file_path}: 未找到字数统计")
            return False

        current_chars = int(match.group(1))
        diff = actual_chars - current_chars

        if abs(diff) < 200:  # 差异小于200字符，认为准确
            print(f"✅ {file_path}: 字数准确 (current={current_chars}, actual={actual_chars})")
            return False

        # 替换字数
        new_content = re.sub(
            pattern,
            f'📖 字数：约{actual_chars}字',
            content
        )

        # 写回文件
        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

        print(f"✏️ {file_path}: {current_chars} → {actual_chars} (diff={diff:+d})")
        return True

    except Exception as e:
        print(f"❌ {file_path}: {e}")
        return False

def main():
    """批量修正所有文章"""
    import sys

    dry_run = '--dry-run' in sys.argv

    posts_dir = '/root/.openclaw/workspace/yoko-blog/posts'

    if not os.path.exists(posts_dir):
        print(f"❌ 目录不存在: {posts_dir}")
        return

    html_files = [
        f for f in os.listdir(posts_dir)
        if f.endswith('.html') and not f.startswith('.')
    ]

    print(f"📊 找到 {len(html_files)} 篇文章")
    if dry_run:
        print("🔍 预览模式（不会修改文件）")
    print("=" * 50)

    fixed_count = 0
    for filename in sorted(html_files):
        file_path = os.path.join(posts_dir, filename)
        if fix_article_wordcount(file_path, dry_run=dry_run):
            fixed_count += 1

    print("=" * 50)
    if dry_run:
        print(f"✨ 预览完成！建议修正 {fixed_count}/{len(html_files)} 篇文章")
    else:
        print(f"✨ 完成！共修正 {fixed_count}/{len(html_files)} 篇文章")

if __name__ == '__main__':
    main()
