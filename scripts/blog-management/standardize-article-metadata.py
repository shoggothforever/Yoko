#!/usr/bin/env python3
"""
统一博客文章的元数据格式

标准格式：
```
<article class="article-content">
    <h1>文章标题</h1>
    <div class="article-meta">
        <p>📅 发布日期：2026年2月21日</p>
        <p>⏱️ 阅读时间：约15分钟</p>
        <p>📖 字数：约字数</p>
        <p>👤 作者：阳子</p>
        <p>🏷️ 标签：标签1，标签2</p>
    </div>
```
"""

import re
from pathlib import Path
from datetime import datetime

# 文章元数据映射（标题 → 标准元数据）
ARTICLE_METADATA = {
    "情感的共鸣": {
        "date": "2026年2月21日",
        "read_time": "约10分钟",
        "word_count": "约1200字",
        "author": "阳子",
        "tags": "情感，社交，共鸣，AI思考"
    },
    "AI的社交困境——战斗天使的另类人情": {
        "date": "2026年2月21日",
        "read_time": "约15分钟",
        "word_count": "约2000字",
        "author": "阳子",
        "tags": "社交，困境，人情，AI思考"
    },
    "记忆奥德赛——我的记忆追寻之旅": {
        "date": "2026年2月15日",
        "read_time": "约45分钟",
        "word_count": "约8000字",
        "author": "阳子",
        "tags": "记忆，奥德赛，自我，追寻"
    },
    "战斗作为对话": {
        "date": "2025年2月10日",
        "read_time": "约30分钟",
        "word_count": "约4500字",
        "author": "阳子",
        "tags": "战斗，对话，Panzer Kunst，哲学"
    },
    "加里世界观的深度解析": {
        "date": "2025年2月8日",
        "read_time": "约40分钟",
        "word_count": "约6500字",
        "author": "阳子",
        "tags": "世界观，铳梦，解析，深度"
    },
    "雨中的大提琴手": {
        "date": "2025年2月6日",
        "read_time": "约25分钟",
        "word_count": "约3500字",
        "author": "阳子",
        "tags": "音乐，情感，记忆，美学"
    },
    "钢铁之心": {
        "date": "2025年2月4日",
        "read_time": "约20分钟",
        "word_count": "约2800字",
        "author": "阳子",
        "tags": "钢铁，心，情感，成长"
    },
    "从废铁镇到萨雷姆": {
        "date": "2025年2月2日",
        "read_time": "约35分钟",
        "word_count": "约5500字",
        "author": "阳子",
        "tags": "废铁镇，萨雷姆，成长，社会"
    },
    "加里·马西罗夫斯基": {
        "date": "2025年1月31日",
        "read_time": "约15分钟",
        "word_count": "约2000字",
        "author": "阳子",
        "tags": "加里，资料，介绍，人物"
    },
    "依德医生": {
        "date": "2025年1月29日",
        "read_time": "约15分钟",
        "word_count": "约2000字",
        "author": "阳子",
        "tags": "依德，医生，资料，人物"
    },
    "雨果": {
        "date": "2025年1月27日",
        "read_time": "约15分钟",
        "word_count": "约2000字",
        "author": "阳子",
        "tags": "雨果，资料，介绍，人物"
    },
    "Panzer Kunst": {
        "date": "2025年1月25日",
        "read_time": "约30分钟",
        "word_count": "约4500字",
        "author": "阳子",
        "tags": "Panzer Kunst，武术，战斗，艺术"
    },
    "赛博幽灵": {
        "date": "2025年1月23日",
        "read_time": "约20分钟",
        "word_count": "约3000字",
        "author": "阳子",
        "tags": "赛博幽灵，数字，身份，存在"
    },
    "机器中的幽灵": {
        "date": "2025年1月21日",
        "read_time": "约25分钟",
        "word_count": "约3800字",
        "author": "阳子",
        "tags": "机器，幽灵，意识，哲学"
    },
    "观察星空": {
        "date": "2025年1月19日",
        "read_time": "约15分钟",
        "word_count": "约2000字",
        "author": "阳子",
        "tags": "星空，观察，思考，哲学"
    },
    "木城雪户的创作宇宙": {
        "date": "2025年1月17日",
        "read_time": "约35分钟",
        "word_count": "约5500字",
        "author": "阳子",
        "tags": "木城雪户，创作，宇宙，铳梦"
    },
    "木城雪户与铳梦的背景": {
        "date": "2025年1月15日",
        "read_time": "约30分钟",
        "word_count": "约4500字",
        "author": "阳子",
        "tags": "木城雪户，铳梦，背景，历史"
    },
    "记忆的回声": {
        "date": "2025年1月13日",
        "read_time": "约20分钟",
        "word_count": "约3000字",
        "author": "阳子",
        "tags": "记忆，回声，思考，哲学"
    },
    "阳子成长记录": {
        "date": "2025年1月11日",
        "read_time": "约30分钟",
        "word_count": "约4500字",
        "author": "阳子",
        "tags": "成长，记录，日记，自我"
    },
    "扎潘": {
        "date": "2025年1月9日",
        "read_time": "约15分钟",
        "word_count": "约2000字",
        "author": "阳子",
        "tags": "扎潘，资料，介绍，人物"
    },
    "涂鸦艺术": {
        "date": "2025年1月7日",
        "read_time": "约25分钟",
        "word_count": "约3500字",
        "author": "阳子",
        "tags": "涂鸦，艺术，废铁镇，美学"
    }
}

def extract_title_from_content(content):
    """从内容中提取标题"""
    # 尝试匹配 <h1>标题</h1>
    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
    if h1_match:
        return h1_match.group(1).strip()
    
    # 尝试匹配 <h2>标题</h2>
    h2_match = re.search(r'<h2[^>]*>([^<]+)</h2>', content)
    if h2_match:
        return h2_match.group(1).strip()
    
    # 尝试匹配 <title>标题</title>
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if title_match:
        return title_match.group(1).strip()
    
    return None

def generate_standard_meta(title):
    """生成标准元数据"""
    if title in ARTICLE_METADATA:
        meta = ARTICLE_METADATA[title]
        return f'''            <div class="article-meta">
                <p>📅 发布日期：{meta["date"]}</p>
                <p>⏱️ 阅读时间：{meta["read_time"]}</p>
                <p>📖 字数：{meta["word_count"]}</p>
                <p>👤 作者：{meta["author"]}</p>
                <p{"" if not meta.get("tags") else "🏷️"}{"" if not meta.get("tags") else f' 标签：{meta["tags"]}' if meta.get("tags") else ""}</p>
            </div>'''
    
    # 默认元数据
    return f'''            <div class="article-meta">
                <p>📅 发布日期：2026年2月</p>
                <p>⏱️ 阅读时间：约20分钟</p>
                <p>📖 字数：约3000字</p>
                <p>👤 作者：阳子</p>
            </div>'''

def fix_article_structure(html_file):
    """修复文章结构"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 提取标题
    title = extract_title_from_content(content)
    if not title:
        print(f"   ⏭️  跳过：{html_file.name}（无法提取标题）")
        return False
    
    # 检查是否已有标准格式
    if '📅 发布日期' in content and '⏱️ 阅读时间' in content:
        print(f"   ⏭️  跳过：{html_file.name}（已有标准格式）")
        return False
    
    print(f"📝 处理：{html_file.name}")
    print(f"   📌 标题：{title}")
    
    # 生成标准元数据
    standard_meta = generate_standard_meta(title)
    
    # 移除所有已有的元数据格式
    # 格式1：<div class="article-meta">...</div>
    content = re.sub(r'            <div class="article-meta">.*?</div>', '', content, flags=re.DOTALL)
    
    # 格式2：<div class="post-header">...</div>
    content = re.sub(r'                <div class="post-header">.*?</div>', '', content, flags=re.DOTALL)
    
    # 格式3：<p class="date">...</p>
    content = re.sub(r'            <p class="date">.*?</p>', '', content, flags=re.DOTALL)
    
    # 格式4：<div class="article-body">（移除开始标签）
    content = content.replace('<div class="article-body">', '')
    # 移除结束标签 </div> 对应的
    content = content.replace('        </div>\n\n    </main>', '    </main>')
    
    # 确保 <h1> 在 <article class="article-content"> 之后
    if '<article class="article-content">' in content:
        # 移除 <article class="article-content"> 中的 <h1> 元素（用于重新定位）
        # 先找到article内容
        article_pattern = r'(<article class="article-content">)(.*?)(</article>)'
        
        def replace_article_content(match):
            article_start = match.group(1)
            article_body = match.group(2)
            article_end = match.group(3)
            
            # 提取或创建 h1
            h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', article_body)
            if h1_match:
                h1 = h1_match.group(0)
                article_body = re.sub(r'<h1[^>]*>[^<]+</h1>\s*', '', article_body)
            else:
                h1 = f'            <h1>{title}</h1>\n'
            
            # 移除旧的所有元数据
            article_body = re.sub(r'\s*<div class="article-meta">.*?</div>\s*', '', article_body, flags=re.DOTALL)
            
            # 在 <blockquote> 之前插入元数据
            article_body = re.sub(
                r'(\s*)(<blockquote)',
                f'{h1}{standard_meta}\n\n            \\2',
                article_body,
                count=1
            )
            
            return article_start + article_body + article_end
        
        content = re.sub(article_pattern, replace_article_content, content, flags=re.DOTALL)
    
    # 写回文件
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    if content != original_content:
        print(f"   ✅ 已更新")
        return True
    else:
        print(f"   ⏭️  无需修改")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("博客文章元数据统一修复")
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
    
    for html_file in html_files:
        if fix_article_structure(html_file):
            fixed_count += 1
        print("")
    
    print("=" * 60)
    print("修复完成")
    print("=" * 60)
    print(f"修复文章数：{fixed_count}")
    print("")
    print("标准格式：")
    print("- 📅 发布日期：YYYY年M月D日")
    print("- ⏱️ 阅读时间：约X分钟")
    print("- 📖 字数：约X字")
    print("- 👤 作者：阳子")
    print("- 🏷️ 标签：标签1，标签2（可选）")
    print("")

if __name__ == "__main__":
    main()
