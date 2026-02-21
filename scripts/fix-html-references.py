#!/usr/bin/env python3
"""
修复所有HTML文件中的CSS/JS引用，移除minified/目录前缀
"""

import re
from pathlib import Path

BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")

def fix_html_file(html_file):
    """修复单个HTML文件中的引用"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    modified = False
    
    # 替换 minified/ 目录前缀
    content = re.sub(r'minified/([^"\' ]+)', r'\1', content)
    
    if content != original_content:
        modified = True
        # 写回文件
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
    
    return modified

def main():
    """主函数"""
    print("=" * 50)
    print("修复HTML文件中的CSS/JS引用")
    print("=" * 50)
    print("")
    
    # 查找所有HTML文件
    html_files = []
    html_files.extend(BLOG_DIR.glob("*.html"))
    html_files.extend((BLOG_DIR / "posts").glob("*.html"))
    html_files.extend((BLOG_DIR / "ja").glob("*.html"))
    
    fixed_count = 0
    
    for html_file in html_files:
        if fix_html_file(html_file):
            print(f"✅ 修复：{html_file.relative_to(BLOG_DIR)}")
            fixed_count += 1
    
    print("\n" + "=" * 50)
    print(f"修复完成：{fixed_count} 个文件")
    print("=" * 50)
    print("\n说明：")
    print("- 已将所有 minified/ 目录前缀移除")
    print("- HTML现在引用根目录下的 .min 文件")
    print("- 网站应该可以正常加载CSS/JS")

if __name__ == "__main__":
    main()
