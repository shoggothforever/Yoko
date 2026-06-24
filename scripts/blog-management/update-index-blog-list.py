#!/usr/bin/env python3
"""
自动更新 index.html 中的博客列表
根据 posts 目录下的实际 HTML 文件生成首页文章列表（只显示最新的6篇）
"""

import os
import re
from pathlib import Path
from datetime import datetime

# 路径配置
BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")
POSTS_DIR = BLOG_DIR / "posts"
INDEX_FILE = BLOG_DIR / "index.html"

# 文件名到标题的映射（用于没有正确标题的文章）
TITLE_MAP = {
    "cyber-ghost.html": "赛博空间的幽灵——当意识可以脱离肉体存在时",
    "gunnm-worldview.html": "《铳梦》的世界观设定——赛博朋克下的悲壮史诗",
    "kishiro-gunnm-background.html": "木城幸人与《铳梦》的创作背景",
    "yoko-growth.html": "阳子（加里）的个人成长轨迹——从失忆少女到战斗天使",
    "battle-as-dialogue.html": "战斗即对话——我的战斗理念",
    "cellist.html": "大提琴与流星——音乐如何触动改造人的心弦",
    "dr-ido.html": "依德医生——我的父亲、老师、朋友",
    "graffiti-art.html": "涂鸦——在钢铁墙壁上的生命之花",
    "watching-stars.html": "仰望星空——在废铁镇中寻找希望",
    "zapan.html": "萨曼——对手与知音",
    "hugo.html": "雨果——我最重要的人",
    "memory-echoes.html": "记忆的残响——过去如何在现在回响",
    "steel-heart.html": "钢铁之心——机械身体里的炽热灵魂",
}

def extract_article_info(html_file):
    """从 HTML 文件中提取文章信息"""
    content = html_file.read_text(encoding='utf-8', errors='ignore')
    
    # 提取标题 - 优先从 h1 提取，其次从 meta title
    title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content, re.IGNORECASE)
    if title_match:
        title = title_match.group(1).strip()
    else:
        title_match = re.search(r'<title>([^<]+)</title>', content, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else html_file.stem
    
    # 如果标题是默认的，使用映射
    if "阳子 Yoko - 阳子博客" in title or "阳子  - 阳子博客" in title:
        # 尝试从 h2 找第一个有效的标题
        h2_matches = re.findall(r'<h2[^>]*>([^<]+)</h2>', content, re.IGNORECASE)
        # 排除一些常见的章节标题
        skip_titles = ["残响的三个层次", "残响的价值", "整合残响", "结论"]
        for h2 in h2_matches:
            h2_clean = h2.strip()
            if len(h2_clean) > 10 and h2_clean not in skip_titles:
                title = h2_clean
                break
        
        # 如果还是默认的，使用映射
        if "阳子 Yoko - 阳子博客" in title or "阳子  - 阳子博客" in title:
            title = TITLE_MAP.get(html_file.name, html_file.stem.replace('-', ' ').title())
    
    # 提取日期 - 优先从标准元数据提取，其次从内容
    date_match = re.search(r'📅 发布日期：(\d{4})年(\d{1,2})月(\d{1,2})日', content)
    if date_match:
        year = date_match.group(1)
        month = date_match.group(2).zfill(2)
        day = date_match.group(3).zfill(2)
        date = f"{year}-{month}-{day}"
    else:
        # 尝试从 "发布于 YYYY年MM月DD日" 格式提取
        desc_match = re.search(r'发布于\s*(\d{4})年(\d{1,2})月(\d{1,2})日', content)
        if desc_match:
            year = desc_match.group(1)
            month = desc_match.group(2).zfill(2)
            day = desc_match.group(3).zfill(2)
            date = f"{year}-{month}-{day}"
        else:
            # 尝试从 "YYYY-MM-DD" 格式提取
            desc_match = re.search(r'(\d{4})-(\d{1,2})-(\d{1,2})', content)
            if desc_match:
                year = desc_match.group(1)
                month = desc_match.group(2).zfill(2)
                day = desc_match.group(3).zfill(2)
                date = f"{year}-{month}-{day}"
            else:
                # 从文件修改时间获取日期
                mod_time = datetime.fromtimestamp(html_file.stat().st_mtime)
                date = mod_time.strftime("%Y-%m-%d")
    
    # 提取摘要 - 从文章内容的第一个有意义段落
    p_matches = re.findall(r'<p[^>]*>([^<]{20,})</p>', content, re.IGNORECASE)
    excerpt = "点击查看文章详情"
    if p_matches:
        for p in p_matches:
            p_clean = re.sub(r'<[^>]+>', '', p).strip()
            # 排除纯日期的内容
            if not re.match(r'^[\d\-年月日\s·分钟字作者]+$', p_clean) and len(p_clean) > 15:
                excerpt = p_clean
                # 限制长度
                if len(excerpt) > 150:
                    excerpt = excerpt[:147] + "..."
                break
    
    return {
        'title': title,
        'date': date,
        'excerpt': excerpt,
        'filename': html_file.relative_to(POSTS_DIR).as_posix(),
        'date_obj': datetime.strptime(date, "%Y-%m-%d")
    }

def update_index_blog_list(articles):
    """更新 index.html 中的博客列表"""
    
    # 生成最新的6篇文章的HTML
    articles.sort(key=lambda x: x['date_obj'], reverse=True)
    latest_articles = articles[:6]  # 只取最新的6篇
    
    blog_list_html = ""
    for article in latest_articles:
        blog_list_html += f'''                <article class="blog-post" data-title="{article['title']}" data-excerpt="{article['excerpt']}">
                    <h3 class="post-title"><a href="posts/{article['filename']}">{article['title']}</a></h3>
                    <p class="post-date">{article['date']}</p>
                    <p class="post-excerpt">{article['excerpt']}</p>
                </article>
'''
    
    # 读取现有的 index.html
    index_content = INDEX_FILE.read_text(encoding='utf-8')
    
    # 找到 <div class="blog-list" id="blog-list"> 和 </div>（结束标签）
    pattern = r'(<div class="blog-list" id="blog-list">)(.*?)(</div>)'
    
    match = re.search(pattern, index_content, re.DOTALL | re.IGNORECASE)
    if not match:
        print("错误：找不到 index.html 中的博客列表区域")
        return False
    
    # 替换博客列表内容
    new_index_content = index_content[:match.start()] + match.group(1) + blog_list_html + "\n            " + match.group(3) + index_content[match.end():]
    
    # 写入文件
    INDEX_FILE.write_text(new_index_content, encoding='utf-8')
    return True

def main():
    """主函数"""
    print("正在更新 index.html 的博客列表...")
    
    # 确保目录存在
    if not POSTS_DIR.exists():
        print(f"错误：文章目录不存在：{POSTS_DIR}")
        return
    
    # 找到所有 HTML 文件
    html_files = sorted(POSTS_DIR.rglob("*.html"))
    
    if not html_files:
        print("错误：没有找到任何文章文件")
        return
    
    print(f"找到 {len(html_files)} 篇文章")
    
    # 提取所有文章信息
    articles = []
    for html_file in html_files:
        info = extract_article_info(html_file)
        articles.append(info)
    
    # 更新 index.html
    if update_index_blog_list(articles):
        print(f"\n✅ 成功更新：{INDEX_FILE}")
        print(f"   首页显示最新的6篇文章")

if __name__ == "__main__":
    main()
