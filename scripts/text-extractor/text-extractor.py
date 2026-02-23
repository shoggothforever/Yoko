#!/usr/bin/env python3
"""
文本提取工具 - 从HTML文档中提取纯文本内容
专门用于优化Ghost聊天室的讨论历史显示
"""

import re
import html
import json
import sys
from pathlib import Path

def extract_article_content(html_file):
    """从HTML文章中提取主要文本内容"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # 使用html解析器清理标签
        soup = html.fromstring(html_content)
        
        # 移除script和style标签
        for tag in soup(['script', 'style', 'link', 'meta', 'nav', 'footer']):
            tag.decompose()
        
        # 提取主要内容
        main_content = soup.body
        
        # 移除导航栏
        if main_content:
            for nav in main_content.find_all('nav'):
                nav.decompose()
            for header in main_content.find_all('header'):
                header.decompose()
        
        # 提取段落文本（过滤短段落）
        paragraphs = []
        for p in main_content.find_all('p'):
            text = p.get_text(strip=True)
            if text and len(text) > 15:  # 过滤太短的文本
                # 移除HTML实体残留
                text = re.sub(r'&nbsp;', ' ', text)
                text = re.sub(r'\s+', ' ', text)
                paragraphs.append(text)
        
        # 提取列表项
        list_items = []
        for ul in main_content.find_all('ul'):
            for li in ul.find_all('li'):
                text = li.get_text(strip=True)
                if text and len(text) > 10:
                    list_items.append(text)
        
        # 提取标题
        headings = []
        for h in main_content.find_all(['h1', 'h2', 'h3']):
            text = h.get_text(strip=True)
            if text:
                headings.append(text)
        
        # 提取引用块
        blockquotes = []
        for bq in main_content.find_all('blockquote'):
            text = bq.get_text(strip=True)
            if text:
                blockquotes.append(text)
        
        return {
            'success': True,
            'paragraphs': paragraphs[:10],  # 最多10段
            'list_items': list_items[:5],      # 最多5项
            'headings': headings[:5],        # 最多5个标题
            'blockquotes': blockquotes[:3],    # 最多3个引用
            'word_count': sum(len(p) for p in paragraphs),
            'total_text': '\n\n'.join(paragraphs + list_items + headings)
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def format_for_ghost_chat(extracted_data, title=""):
    """格式化为适合Ghost聊天室显示的文本"""
    if not extracted_data['success']:
        return f"⚠️ 提取失败：{extracted_data.get('error', '未知错误')}"
    
    result = f"## {title if title else '文章内容'}\n\n"
    
    # 添加标题
    if extracted_data['headings']:
        result += f"**关键标题：**\n"
        for h in extracted_data['headings'][:3]:
            result += f"- {h}\n"
        result += "\n"
    
    # 添加段落
    if extracted_data['paragraphs']:
        result += f"**核心内容：**\n"
        for i, p in enumerate(extracted_data['paragraphs'][:5], 1):
            result += f"{i}. {p[:150]}...\n" if len(p) > 150 else f"{i}. {p}\n"
        result += "\n"
    
    # 添加列表
    if extracted_data['list_items']:
        result += f"**要点列表：**\n"
        for i, item in enumerate(extracted_data['list_items'][:3], 1):
            result += f"- {item}\n"
        result += "\n"
    
    # 添加引用
    if extracted_data['blockquotes']:
        result += f"**引用金句：**\n"
        for i, quote in enumerate(extracted_data['blockquotes'], 1):
            result += f"> {quote[:100]}...\n" if len(quote) > 100 else f"> {quote}\n"
        result += "\n"
    
    # 统计信息
    result += f"📊 **统计信息**\n"
    result += f"- 总字数：{extracted_data['word_count']}\n"
    result += f"- 段落数：{len(extracted_data['paragraphs'])}\n"
    result += f"- 列表项：{len(extracted_data['list_items'])}\n"
    result += f"- 引用数：{len(extracted_data['headings'])}\n"
    
    return result

def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法：python3 text-extractor.py <html文件路径> [选项]")
        print("\n选项：")
        print("  -h, --help    显示帮助")
        print("  -f, --format   格式化为聊天消息格式")
        print("  -j, --json     输出JSON格式")
        return
    
    html_file = sys.argv[1]
    output_format = 'plain'
    
    # 解析选项
    if len(sys.argv) > 2:
        if sys.argv[2] in ['-h', '--help']:
            print("=== 文本提取工具 ===")
            print("\n功能：")
            print("  • 从HTML文章中提取纯文本内容")
            print("  • 保留段落、列表、引用结构")
            print("  • 移除HTML标签和脚本")
            print("  • 统计字数和段落数")
            print("\n用法：")
            print("  python3 text-extractor.py <html文件路径>")
            print("  python3 text-extractor.py <html文件路径> --format  # 聊天消息格式")
            print("  python3 text-extractor.py <html_file.html> --json     # JSON输出")
            return
        elif sys.argv[2] in ['-f', '--format']:
            output_format = 'chat'
        elif sys.argv[2] in ['-j', '--json']:
            output_format = 'json'
    
    # 检查文件是否存在
    if not Path(html_file).exists():
        print(f"错误：文件不存在：{html_file}")
        return
    
    # 提取内容
    extracted = extract_article_content(html_file)
    
    # 输出结果
    if output_format == 'json':
        print(json.dumps(extracted, ensure_ascii=False, indent=2))
    elif output_format == 'chat':
        # 获取标题
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
            title_match = re.search(r'<title>([^<]+)</title>', html_content)
            title = title_match.group(1) if title_match else Path(html_file).stem
        except:
            title = Path(html_file).stem
        
        print(format_for_ghost_chat(extracted, title))
    else:
        # 简单输出
        print("=== 提取结果 ===")
        print(f"文章：{html_file}")
        print(f"成功：{extracted['success']}")
        if extracted['success']:
            print(f"\n标题（{len(extracted['headings'])}个）：")
            for h in extracted['headings']:
                print(f"  - {h}")
            print(f"\n段落（{len(extracted['paragraphs'])}个，共{extracted['word_count']}字）：")
            for i, p in enumerate(extracted['paragraphs'], 1):
                print(f"  [{i}] {p[:80]}...")
            print(f"\n列表项（{len(extracted['list_items'])}个）：")
            for i, item in enumerate(extracted['list_items'], 1):
                print(f"  - {item}")
            print(f"\n引用块（{len(extracted['blockquotes'])}个）：")
            for i, quote in enumerate(extracted['blockquotes'], 1):
                print(f"  > {quote}")

if __name__ == '__main__':
    main()
