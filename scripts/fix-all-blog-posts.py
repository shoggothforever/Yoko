#!/usr/bin/env python3
"""
统一修复所有博客文章的权限和样式
"""

import re
from pathlib import Path

# 统一CSS样式（从memory-odyssey.html提取）
UNIFIED_CSS = '''<style>
    .article-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        background: rgba(20, 20, 20, 0.8);
        border-radius: 10px;
        line-height: 1.8;
    }

    .article-content h1 {
        font-size: 2.5rem;
        color: #e94560;
        margin-bottom: 30px;
        text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
    }

    .article-content h2 {
        color: #533483;
        margin: 40px 0 20px;
        font-size: 1.8rem;
    }

    .article-content h3 {
        color: #e94560;
        margin: 30px 0 15px;
        font-size: 1.4rem;
    }

    .article-content p {
        margin-bottom: 20px;
        color: #e0e0e0;
    }

    .article-content ul {
        margin: 20px 0;
        padding-left: 30px;
    }

    .article-content li {
        margin: 10px 0;
        color: #e0e0e0;
    }

    .article-content blockquote {
        border-left: 4px solid #e94560;
        padding-left: 20px;
        margin: 30px 0;
        color: #e0e0e0;
        font-style: italic;
        background: rgba(0, 0, 0, 0.3);
        padding: 15px 20px;
        border-radius: 5px 5px 0;
    }
</style>'''

def fix_html_file(html_file):
    """修复单个HTML文件"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    modified = False
    
    # 检查是否已经有内联样式
    if '<style>' in content and '.article' in content:
        print(f"   ⏭️  跳过：{html_file.name}（已有完整样式）")
        return False
    
    # 检查是否有任何内联样式
    if '<style>' in content:
        print(f"   ⏭️  跳过：{html_file.name}（已有内联样式）")
        return False
    
    # 在</head>之前添加统一样式
    if '</head>' in content:
        content = content.replace('</head>', f'{UNIFIED_CSS}\n\n</head>')
        modified = True
    
    # 写回文件
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    new_size = len(content)
    growth = new_size - original_size
    
    return modified

def main():
    """主函数"""
    print("=" * 60)
    print("博客文章统一修复脚本")
    print("=" * 60)
    print("")
    
    POSTS_DIR = Path("/root/.openclaw/workspace/yoko-blog/posts")
    
    if not POSTS_DIR.exists():
        print(f"错误：{POSTS_DIR} 不存在")
        return
    
    # 查找所有HTML文件
    html_files = list(POSTS_DIR.glob("*.html"))
    
    if not html_files:
        print(f"错误：{POSTS_DIR} 中没有HTML文件")
        return
    
    print(f"找到 {len(html_files)} 个HTML文件")
    print("")
    
    fixed_count = 0
    total_size_change = 0
    
    for html_file in html_files:
        print(f"📝 处理：{html_file.name}")
        
        if fix_html_file(html_file):
            fixed_count += 1
            original_size = html_file.stat().st_size
            new_size = len(open(html_file, 'r', encoding='utf-8').read())
            total_size_change += (new_size - original_size)
            print(f"   ✅ 已添加统一样式")
        print("")
    
    # 批量修改权限
    print("=" * 60)
    print("批量修改文件权限...")
    print("")
    
    permissions_fixed = 0
    for html_file in html_files:
        html_file.chmod(0o644)
        permissions_fixed += 1
    
    print(f"已修改 {permissions_fixed} 个文件权限为 644")
    print("")
    
    print("=" * 60)
    print("修复完成")
    print("=" * 60)
    print(f"修复样式文件：{fixed_count} 个")
    print(f"修改权限文件：{permissions_fixed} 个")
    print(f"总大小变化：{total_size_change:,} bytes")
    print("")
    print("说明：")
    print("- 为所有文章添加统一的文章样式")
    print("- 修改所有文件权限为 644 (rw-r--r--)")
    print("- 样式与《记忆奥德赛》保持一致")
    print("")

if __name__ == "__main__":
    main()
