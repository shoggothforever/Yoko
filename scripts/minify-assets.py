#!/usr/bin/env python3
"""
简单的CSS/JS压缩脚本
移除注释、多余空格和换行符
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

def compress_js(js_content):
    """压缩JS内容（基础版）"""
    # 移除单行注释
    js_content = re.sub(r'//.*', '', js_content)
    
    # 移除多行注释
    js_content = re.sub(r'/\*[\s\S]*?\*/', '', js_content)
    
    # 移除多余空格和换行
    js_content = re.sub(r'\s+', ' ', js_content)
    js_content = re.sub(r'\s*([{}();,=+\-*/])\s*', r'\1', js_content)
    
    return js_content.strip()

def process_file(input_file, output_file, file_type):
    """处理单个文件"""
    # 读取文件
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    
    # 压缩
    if file_type == 'css':
        compressed = compress_css(content)
    elif file_type == 'js':
        compressed = compress_js(content)
    else:
        print(f"   ⚠️  不支持的文件类型：{file_type}")
        return False
    
    compressed_size = len(compressed)
    reduction = (1 - compressed_size / original_size) * 100
    
    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(compressed)
    
    print(f"   原始大小：{original_size:,} bytes")
    print(f"   压缩后：{compressed_size:,} bytes")
    print(f"   减少：{reduction:.1f}%")
    
    return True

def main():
    """主函数"""
    print("=" * 50)
    print("CSS/JS压缩脚本")
    print("=" * 50)
    
    MINIFIED_DIR = Path("/root/.openclaw/workspace/yoko-blog/minified")
    MINIFIED_DIR.mkdir(exist_ok=True)
    
    # 要压缩的文件
    files_to_compress = [
        {
            "input": Path("/root/.openclaw/workspace/yoko-blog/style.css"),
            "output": MINIFIED_DIR / "style.min.css",
            "type": "css"
        },
        {
            "input": Path("/root/.openclaw/workspace/yoko-blog/script.js"),
            "output": MINIFIED_DIR / "script.min.js",
            "type": "js"
        },
        {
            "input": Path("/root/.openclaw/workspace/yoko-blog/ghost-chatroom.css"),
            "output": MINIFIED_DIR / "ghost-chatroom.min.css",
            "type": "css"
        },
        {
            "input": Path("/root/.openclaw/workspace/yoko-blog/ghost.js"),
            "output": MINIFIED_DIR / "ghost.min.js",
            "type": "js"
        },
    ]
    
    success_count = 0
    total_original = 0
    total_compressed = 0
    
    for file_info in files_to_compress:
        input_file = file_info["input"]
        output_file = file_info["output"]
        file_type = file_info["type"]
        
        if not input_file.exists():
            print(f"⏭️  跳过：{input_file.name}（文件不存在）")
            continue
        
        print(f"\n📝 处理：{input_file.name}")
        
        if process_file(input_file, output_file, file_type):
            success_count += 1
            total_original += input_file.stat().st_size
            total_compressed += output_file.stat().st_size
            print(f"   ✅ 完成 → {output_file.name}")
        else:
            print(f"   ❌ 失败")
    
    print("\n" + "=" * 50)
    print("压缩完成")
    print("=" * 50)
    print(f"成功压缩：{success_count} 个文件")
    
    if success_count > 0:
        total_reduction = (1 - total_compressed / total_original) * 100
        print(f"总原始大小：{total_original:,} bytes")
        print(f"总压缩后：{total_compressed:,} bytes")
        print(f"总体减少：{total_reduction:.1f}%")
    
    print(f"\n压缩文件位置：{MINIFIED_DIR}")
    print("\n使用提示：")
    print("1. 测试压缩后的文件是否正常工作")
    print("2. 确认无误后，替换原始文件")
    print("3. 或在HTML中引用 .min 版本")

if __name__ == "__main__":
    main()
