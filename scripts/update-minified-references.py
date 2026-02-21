#!/usr/bin/env python3
"""
自动更新HTML文件引用压缩版本（.min.css 和 .min.js）
"""

import re
from pathlib import Path

BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")

# 要替换的映射
REPLACEMENTS = [
    ("style.css", "style.min.css"),
    ("script.js", "script.min.js"),
    ("ghost-chatroom.css", "ghost-chatroom.min.css"),
    ("ghost.js", "ghost.min.js"),
]

def update_html_file(html_file):
    """更新单个HTML文件"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    modified = False
    
    # 替换引用
    for original, minified in REPLACEMENTS:
        # 查找并替换
        pattern = re.escape(original)
        if re.search(pattern, content):
            content = re.sub(pattern, minified, content)
            modified = True
    
    if modified:
        # 写回文件
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """主函数"""
    print("=" * 50)
    print("更新HTML引用压缩版本")
    print("=" * 50)
    print("")
    
    # 查找所有HTML文件
    html_files = []
    html_files.extend(BLOG_DIR.glob("*.html"))
    html_files.extend((BLOG_DIR / "posts").glob("*.html"))
    html_files.extend((BLOG_DIR / "ja").glob("*.html"))
    
    updated_count = 0
    
    for html_file in html_files:
        if update_html_file(html_file):
            print(f"✅ 更新：{html_file.relative_to(BLOG_DIR)}")
            updated_count += 1
    
    print("\n" + "=" * 50)
    print(f"更新完成：{updated_count} 个文件")
    print("=" * 50)
    print("\n说明：")
    print("- 已将所有CSS/JS引用更新为 .min 版本")
    print("- 网站将使用压缩后的文件")
    print("- 原始文件保留在原位置")

if __name__ == "__main__":
    main()
