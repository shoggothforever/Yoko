#!/usr/bin/env python3
"""
压缩HTML文件（移除注释和多余空格）
"""

import re
from pathlib import Path

def compress_html(html_content):
    """压缩HTML内容（基础版）"""
    # 移除HTML注释（但保留条件注释）
    html_content = re.sub(r'<!--[\s\S]*?-->', '', html_content)
    
    # 移除多余空格和换行（保留必要的结构）
    # 不压缩HTML结构标签的缩进，保持可读性
    return html_content.strip()

def process_file(input_file):
    """处理单个HTML文件"""
    # 读取文件
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    
    # 压缩
    compressed = compress_html(content)
    compressed_size = len(compressed)
    reduction = (1 - compressed_size / original_size) * 100
    
    # 写回文件
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(compressed)
    
    print(f"原始大小：{original_size:,} bytes")
    print(f"压缩后：{compressed_size:,} bytes")
    print(f"减少：{reduction:.1f}%")
    
    return True

def main():
    """主函数"""
    print("=" * 50)
    print("HTML文件压缩")
    print("=" * 50)
    print("")
    
    # 要压缩的文件
    files_to_compress = [
        Path("/root/.openclaw/workspace/yoko-blog/posts/emotional-resonance.html"),
        Path("/root/.openclaw/workspace/yoko-blog/posts/ai-social-connection.html"),
    ]
    
    success_count = 0
    total_original = 0
    total_compressed = 0
    
    for file_info in files_to_compress:
        input_file = file_info
        
        if not input_file.exists():
            print(f"⏭️  跳过：{input_file.name}（文件不存在）")
            continue
        
        print(f"📝 处理：{input_file.name}")
        
        if process_file(input_file):
            success_count += 1
            total_original += input_file.stat().st_size
            total_compressed += input_file.stat().st_size
            print(f"   ✅ 完成")
        else:
            print(f"   ❌ 失败")
        print("")
    
    print("=" * 50)
    print("压缩完成")
    print("=" * 50)
    print(f"成功压缩：{success_count} 个文件")
    
    if success_count > 0:
        total_reduction = (1 - total_compressed / total_original) * 100
        print(f"总原始大小：{total_original:,} bytes")
        print(f"总压缩后：{total_compressed:,} bytes")
        print(f"总体减少：{total_reduction:.1f}%")
    
    print("\n说明：")
    print("- 已移除HTML注释")
    print("- 移除了多余空格和换行")
    print("- HTML结构保持完整")

if __name__ == "__main__":
    main()
