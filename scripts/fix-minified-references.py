#!/usr/bin/env python3
"""
将minified目录下的压缩文件移动到根目录，并替换旧文件
"""

from pathlib import Path
import shutil

BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")
MINIFIED_DIR = BLOG_DIR / "minified"

def main():
    """主函数"""
    print("=" * 50)
    print("修复CSS/JS文件引用")
    print("=" * 50)
    
    if not MINIFIED_DIR.exists():
        print(f"错误：{MINIFIED_DIR} 不存在")
        return
    
    # 查找所有.min文件
    minified_files = list(MINIFIED_DIR.glob("*.min.*"))
    
    if not minified_files:
        print(f"错误：{MINIFIED_DIR} 中没有.min文件")
        return
    
    print(f"\n找到 {len(minified_files)} 个压缩文件")
    print("")
    
    moved_count = 0
    total_savings = 0
    
    for min_file in minified_files:
        filename = min_file.name
        target_file = BLOG_DIR / filename
        
        # 检查目标文件是否存在
        old_size = 0
        if target_file.exists():
            old_size = target_file.stat().st_size
        
        # 获取新文件大小
        new_size = min_file.stat().st_size
        
        # 移动文件
        shutil.move(str(min_file), str(target_file))
        
        # 计算节省
        if old_size > 0:
            saving = old_size - new_size
            saving_percent = (saving / old_size) * 100
            total_savings += saving
            print(f"✅ {filename}")
            print(f"   旧：{old_size:,} bytes → 新：{new_size:,} bytes")
            print(f"   节省：{saving:,} bytes ({saving_percent:.1f}%)")
        else:
            print(f"✅ {filename}")
            print(f"   新：{new_size:,} bytes")
        
        moved_count += 1
        print("")
    
    # 检查minified目录是否为空
    remaining_files = list(MINIFIED_DIR.glob("*"))
    if not remaining_files:
        print(f"✅ minified目录已清空，删除目录")
        MINIFIED_DIR.rmdir()
    else:
        print(f"⚠️  minified目录中还剩 {len(remaining_files)} 个文件")
    
    print("=" * 50)
    print("修复完成")
    print("=" * 50)
    print(f"移动文件：{moved_count} 个")
    if total_savings > 0:
        print(f"总节省：{total_savings:,} bytes")

if __name__ == "__main__":
    main()
