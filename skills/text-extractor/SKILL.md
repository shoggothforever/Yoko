#!/usr/bin/env python3
"""
文本清理工具 - 从HTML中提取纯文本内容
用于优化Ghost聊天室的显示效果
"""

import re
import html

def extract_main_text(html_content):
    """从HTML中提取主要的文本内容，移除标签和脚本"""
    
    # 移除script和style标签
    cleaned = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    cleaned = re.sub(r'<style[^>]*>.*?</style>', '', cleaned, flags=re.DOTALL | re.IGNORECASE)
    
    # 移除HTML标签，但保留标签内的文本
    # 使用html的unescape来清理标签但保留内容
    soup = html.fromstring(cleaned)
    
    # 获取主要内容区域
    # 1. 先移除script和style
    for script in soup(['script', 'style']):
        script.decompose()
    
    # 2. 提取段落文本
    paragraphs = []
    for p in soup.find_all('p'):
        text = p.get_text(strip=True)
        if text and len(text) > 10:  # 过滤太短的段落
            paragraphs.append(text)
    
    # 3. 提取列表项
    list_items = []
    for ul in soup.find_all('ul'):
        for li in ul.find_all('li'):
            text = li.get_text(strip=True)
            if text:
                list_items.append(text)
    
    # 4. 提取标题
    headings = []
    for h in soup.find_all(['h1', 'h2', 'h3']):
        text = h.get_text(strip=True)
        if text:
            headings.append(text)
    
    return {
        'paragraphs': paragraphs,
        'list_items': list_items,
        'headings': headings,
        'all_text': ' '.join(paragraphs + list_items + headings)
    }

def format_as_chat_message(text_data):
    """格式化为聊天消息格式"""
    
    message_parts = []
    
    # 添加标题
    if text_data['headings']:
        message_parts.append(f"# {text_data['headings'][0]}")
    
    # 添加段落
    if text_data['paragraphs']:
        message_parts.extend(text_data['paragraphs'][:5])  # 最多5段
    
    # 添加列表
    if text_data['list_items']:
        message_parts.extend(text_data['list_items'][:3])  # 最多3项
    
    return '\n\n'.join(message_parts)

def main():
    import sys
    
    if len(sys.argv) > 1:
        html_file = sys.argv[1]
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        text_data = extract_main_text(html_content)
        formatted = format_as_chat_message(text_data)
        print(formatted)
    else:
        # 示例：处理一些示例HTML
        example_html = """
        <html>
        <head><title>示例</title></head>
        <body>
            <h1>文章标题</h1>
            <p>这是第一段内容，介绍主要观点。</p>
            <p>这是第二段内容，进一步阐述。</p>
            <ul>
                <li>要点一</li>
                <li>要点二</li>
                <li>要点三</li>
            </ul>
        </body>
        </html>
        """
        
        text_data = extract_main_text(example_html)
        formatted = format_as_chat_message(text_data)
        print("=== 提取的文本示例 ===")
        print(formatted)
        print("\n=== 原始数据 ===")
        print(text_data)

if __name__ == '__main__':
    main()
