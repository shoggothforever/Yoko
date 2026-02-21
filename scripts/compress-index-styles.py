#!/usr/bin/env python3
"""
压缩单个CSS文件
"""

import re
from pathlib import Path

def compress_css(css_content):
    """压缩CSS内容"""
    # 移除注释
    css_content = re.sub(r'/\*[\s\S]*?\*/', '', css_content)
    
    # 移除多余空格和换行
    css_content = re.sub(r'\s+', ' ', css_content)
    css_content = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css_content)
    
    # 移除最后分号后的空格
    css_content = re.sub(r';\s*\}', '}', css_content)
    
    return css_content.strip()

def main():
    """主函数"""
    # 输入和输出文件
    input_file = Path("/root/.openclaw/workspace/yoko-blog/index-styles.css")
    output_file = Path("/root/.openclaw/workspace/yoko-blog/minified/index-styles.min.css")
    
    if not input_file.exists():
        print(f"错误：{input_file} 不存在")
        return
    
    print("=" * 50)
    print("压缩index-styles.css")
    print("=" * 50)
    
    # 读取文件
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    
    # 压缩
    compressed = compress_css(content)
    compressed_size = len(compressed)
    reduction = (1 - compressed_size / original_size) * 100
    
    # 写入文件
    output_file.parent.mkdir(exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(compressed)
    
    print(f"原始大小：{original_size:,} bytes")
    print(f"压缩后：{compressed_size:,} bytes")
    print(f"减少：{reduction:.1f}%")
    print(f"\n输出文件：{output_file}")
    print("\n" + "=" * 50)
    print("压缩完成")
    print("=" * 50)

if __name__ == "__main__":
    main()
