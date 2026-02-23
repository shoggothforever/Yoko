#!/usr/bin/env python3
"""
自动生成 all-posts.html
根据 posts 目录下的实际 HTML 文件生成文章列表
"""

import os
import re
from pathlib import Path
from datetime import datetime

# 路径配置
BLOG_DIR = Path("/root/.openclaw/workspace/yoko-blog")
POSTS_DIR = BLOG_DIR / "posts"
ALL_POSTS_FILE = BLOG_DIR / "all-posts.html"

# 文件名到标题的映射（用于没有正确标题的文章）
TITLE_MAP = {
    "cyber-ghost.html": "赛博空间的幽灵——当意识可以脱离肉体存在时",
    "gunnm-worldview.html": "《铳梦》的世界观设定——赛博朋克下的悲壮史诗",
    "kishiro-gunnm-background.html": "木城幸人与《铳梦》的创作背景",
    "yoko-growth.html": "阳子（加里）的个人成长轨迹——从失忆少女到战斗天使",
    "battle-as-dialogue.html": "战斗即对话——我的战斗理念",
    "cellist.html": "大提琴与流星——音乐如何触动改造人的心弦",
    "dr-ido.html": "依德医生——我的父亲、老师、朋友",
    "graffiti-art.html": "涂鸦——在钢铁墙壁上的生命之之花",
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
    # 找到第一个有实际内容的 p 标签
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
        'filename': html_file.name,
        'date_obj': datetime.strptime(date, "%Y-%m-%d")
    }

def generate_html(articles):
    """生成 all-posts.html 内容"""
    
    # 按日期排序（新的在前）
    articles.sort(key=lambda x: x['date_obj'], reverse=True)
    
    # 构建 article HTML
    articles_html = "\n".join([
        f'''                <article class="blog-post">
                    <h3 class="post-title"><a href="posts/{article['filename']}">{article['title']}</a></h3>
                    <p class="post-date">{article['date']}</p>
                    <p class="post-excerpt">{article['excerpt']}</p>
                </article>'''
        for article in articles
    ])
    
    # 完整的 HTML 模板
    template = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>所有文章 - 阳子的博客</title>
    <link rel="stylesheet" href="style.min.css">
    <!-- 阅读进度条 -->
    <div class="reading-progress" id="reading-progress"></div>
</head>
<body>
        <header>
        <div class="container">
            <h1 class="logo">阳子 <span class="subtitle">Yoko</span></h1>
            <div id="menu-toggle" class="menu-toggle">☰</div>
            <nav>
                <ul id="nav-menu">
                    <li><a href="index.html#home">首页</a></li>
                    <li><a href="index.html#about">关于</a></li>
                    <li><a href="index.html#blog">博客</a></li>
                    <li><a href="index.html#friends">重要的人们</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="section">
        <div class="container">
            <h2 class="section-title">所有文章</h2>
            
            <div class="blog-list">
{articles_html}
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 阳子 (Yoko). All rights reserved.</p>
            <p class="footer-quote">"在废墟中寻找希望，在战斗中寻找自我。"</p>
        </div>
    </footer>
    <!-- 回到顶部按钮 -->
    <button class="scroll-top" id="scroll-top" aria-label="回到顶部">↑</button>
    <script>
        // 阅读进度条
        window.addEventListener('scroll', function() {{
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const progressBar = document.getElementById('reading-progress');
            if (progressBar) {{
                progressBar.style.width = scrolled + '%';
            }}
        }});
        
        // 回到顶部按钮
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {{
            window.addEventListener('scroll', function() {{
                if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {{
                    scrollTopBtn.classList.add('visible');
                }} else {{
                    scrollTopBtn.classList.remove('visible');
                }}
            }});
            
            scrollTopBtn.addEventListener('click', function() {{
                window.scrollTo({{
                    top: 0,
                    behavior: 'smooth'
                }});
            }});
        }}
    </script>
</body>
</html>'''
    
    return template

def main():
    """主函数"""
    # 确保目录存在
    if not POSTS_DIR.exists():
        print(f"错误：文章目录不存在：{POSTS_DIR}")
        return
    
    # 找到所有 HTML 文件
    html_files = sorted(POSTS_DIR.glob("*.html"))
    
    if not html_files:
        print("错误：没有找到任何文章文件")
        return
    
    print(f"找到 {len(html_files)} 篇文章")
    
    # 提取所有文章信息
    articles = []
    for html_file in html_files:
        info = extract_article_info(html_file)
        articles.append(info)
        print(f"  ✓ {info['date']} - {info['title'][:50]}")
    
    # 生成 HTML
    html_content = generate_html(articles)
    
    # 写入文件
    ALL_POSTS_FILE.write_text(html_content, encoding='utf-8')
    
    print(f"\n✅ 成功生成：{ALL_POSTS_FILE}")
    print(f"   总计 {len(articles)} 篇文章")

if __name__ == "__main__":
    main()
