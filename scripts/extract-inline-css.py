#!/usr/bin/env python3
"""
提取并优化内联CSS
"""

import re
from pathlib import Path

BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")

def extract_inline_css(html_file):
    """提取HTML文件中的内联CSS"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找所有 <style> 块
    style_pattern = r'<style[^>]*>(.*?)</style>'
    matches = re.findall(style_pattern, content, re.DOTALL)
    
    if not matches:
        print(f"   ⏭️  跳过：{html_file.name}（无内联CSS）")
        return None, None
    
    # 合并所有CSS
    all_css = '\n'.join(matches)
    
    # 移除CSS注释（可选）
    # all_css = re.sub(r'/\*[\s\S]*?\*/', '', all_css)
    
    # 移除多余空格
    all_css = re.sub(r'\n\s*\n', '\n\n', all_css)
    all_css = all_css.strip()
    
    return content, all_css

def replace_inline_css_with_link(html_content, css_file_name):
    """用 <link> 标签替换内联 <style>"""
    # 移除所有 <style> 块
    content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL)
    
    # 在<head>中找到合适的位置插入<link>
    # 查找第一个CSS link标签
    link_pattern = r'(<link rel="stylesheet"[^>]*>)'
    
    if re.search(link_pattern, content):
        # 在第一个CSS link之后插入
        def insert_after_link(match):
            return match.group(1) + f'\n    <link rel="stylesheet" href="{css_file_name}">'
        
        content = re.sub(link_pattern, insert_after_link, content, count=1)
    else:
        # 没有找到CSS link，在<head>之后插入
        head_pattern = r'(<head>)'
        content = re.sub(head_pattern, r'\1\n    <link rel="stylesheet" href="' + css_file_name + '">', content, count=1)
    
    return content

def main():
    """主函数"""
    print("=" * 50)
    print("内联CSS提取与优化")
    print("=" * 50)
    
    # 处理index.html
    index_file = BLOG_DIR / "index.html"
    
    if not index_file.exists():
        print(f"错误：{index_file} 不存在")
        return
    
    print(f"\n📝 处理：{index_file.name}")
    
    # 提取内联CSS
    html_content, css_content = extract_inline_css(index_file)
    
    if css_content is None:
        print("\n未找到内联CSS")
        return
    
    print(f"   原始HTML大小：{len(html_content):,} bytes")
    print(f"   提取的CSS大小：{len(css_content):,} bytes")
    print(f"   CSS行数：{css_content.count(chr(10)) + 1} 行")
    
    # 创建新的CSS文件
    css_filename = "index-styles.css"
    css_file = BLOG_DIR / css_filename
    
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(css_content)
    
    print(f"   ✅ CSS已提取到：{css_filename}")
    
    # 替换HTML中的内联CSS
    new_html_content = replace_inline_css_with_link(html_content, css_filename)
    
    # 写回HTML文件
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(new_html_content)
    
    print(f"   ✅ HTML已更新（引用外部CSS）")
    print(f"   新HTML大小：{len(new_html_content):,} bytes")
    
    # 计算节省
    html_reduction = len(html_content) - len(new_html_content)
    total_size_before = len(html_content)
    total_size_after = len(new_html_content) + len(css_content)
    
    print(f"\n   HTML减少：{html_reduction:,} bytes ({html_reduction/len(html_content)*100:.1f}%)")
    print(f"   总大小变化：{total_size_before:,} → {total_size_after:,} bytes")
    
    print("\n" + "=" * 50)
    print("提取完成")
    print("=" * 50)
    print(f"CSS文件：{css_file}")
    print(f"建议：将CSS文件移动到minified/并压缩")

if __name__ == "__main__":
    main()
