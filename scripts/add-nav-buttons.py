#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import glob

POSTS_DIR = "/root/.openclaw/workspace/yoko-blog/posts"

# 导航按钮模板
NAV_BUTTONS = """            <!-- 导航按钮 -->
            <div class="nav-buttons">
                <a href="../index.html#blog" class="nav-button">返回博客列表</a>
            </div>"""

print("=" * 40)
print("   博客文章导航按钮添加脚本")
print("=" * 40)
print("")

total = 0
updated = 0
skipped = 0

# 遍历所有HTML文件
for filepath in glob.glob(os.path.join(POSTS_DIR, "*.html")):
    total += 1
    filename = os.path.basename(filepath)
    
    # 读取文件
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ 错误：{filename} - {e}")
        skipped += 1
        continue
    
    # 检查是否已有 nav-buttons
    if 'nav-buttons' in content:
        print(f"⏭️  跳过：{filename}（已有导航按钮）")
        skipped += 1
        continue
    
    # 检查是否有 </article>
    if '</article>' not in content:
        print(f"❌ 跳过：{filename}（缺少 </article> 标签）")
        skipped += 1
        continue
    
    # 在 </article> 后添加导航按钮
    parts = content.split('</article>', 1)
    if len(parts) == 2:
        new_content = parts[0] + '</article>\n\n' + NAV_BUTTONS + '\n' + parts[1]
        
        # 写回文件
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ 更新：{filename}")
            updated += 1
        except Exception as e:
            print(f"❌ 错误：{filename} - {e}")
            skipped += 1
    else:
        print(f"❌ 跳过：{filename}（无法定位 </article>）")
        skipped += 1

print("")
print("=" * 40)
print("   处理完成")
print("=" * 40)
print(f"总计：{total} 篇")
print(f"更新：{updated} 篇")
print(f"跳过：{skipped} 篇")
print("")

if updated > 0:
    print("✅ 已为部分文章添加标准导航按钮")
    print("")
    print("建议执行：")
    print("  cd /root/.openclaw/workspace")
    print("  git add yoko-blog/posts/")
    print("  git commit -m '为博客文章添加标准导航按钮'")
    print("  git push")
