#!/usr/bin/env python3
"""
Brave Search API 客户端
通过环境变量获取 API Key，避免在代码中泄露
"""

import argparse
import requests
import sys
import os
import re
import json
from datetime import datetime

# 配置
API_KEY = os.environ.get("BRAVE_API_KEY")
API_URL = "https://api.search.brave.com/res/v1/web/search"

def brave_search(query, count=10, offset=0, text_decorations=False, proxy=None):
    """
    调用 Brave Search API
    """
    if not proxy:
        proxy = os.environ.get("HTTP_PROXY", "http://127.0.0.1:7890")

    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": API_KEY
    }

    params = {
        "q": query,
        "count": count,
        "offset": offset,
        "textDecorations": str(text_decorations).lower(),
        "result_filter": "web"
    }

    proxies = {
        'http': proxy,
        'https': proxy
    } if proxy else None

    try:
        response = requests.get(
            API_URL, 
            headers=headers, 
            params=params, 
            proxies=proxies,
            timeout=15
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}", file=sys.stderr)
        return None

def clean_html(text):
    """移除 HTML 标签，保留纯文本"""
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def format_results_json(data, query):
    """返回 JSON 格式的结果"""
    if not data:
        return json.dumps({"error": "无结果", "query": query}, ensure_ascii=False, indent=2)

    web_results = data.get("web", {}).get("results", [])
    total = len(web_results)

    formatted = {
        "query": query,
        "total_results": total,
        "timestamp": datetime.now().isoformat(),
        "results": []
    }

    for item in web_results:
        title = item.get("title", "无标题")
        url = item.get("url", "")
        desc = item.get("description", item.get("snippet", ""))
        profile = item.get("profile", {})
        
        formatted["results"].append({
            "title": title,
            "url": url,
            "description": clean_html(desc[:200]) if desc else "",
            "source": profile.get("name", "Brave Search"),
            "family_friendly": item.get("family_friendly", False)
        })

    return json.dumps(formatted, ensure_ascii=False, indent=2)

def format_results_text(data, max_desc_length=200):
    """返回纯文本格式的结果"""
    if not data:
        return "无搜索结果"

    web_results = data.get("web", {}).get("results", [])
    total = len(web_results)

    output = []
    output.append(f"找到 {total} 条结果:\n")
    output.append("=" * 60 + "\n")

    for i, item in enumerate(web_results, 1):
        title = item.get("title", "无标题")
        url = item.get("url", "")
        desc = item.get("description", item.get("snippet", ""))
        
        desc = clean_html(desc)
        if len(desc) > max_desc_length:
            desc = desc[:max_desc_length] + "..."
        
        output.append(f"\n{i}. {title}")
        output.append(f"   URL: {url}")
        if desc:
            output.append(f"   描述: {desc}")
        output.append("")

    return "\n".join(output)

def format_results_simple(data):
    """返回简化版文本格式"""
    if not data:
        return "无搜索结果"

    web_results = data.get("web", {}).get("results", [])
    
    output = []
    for item in web_results:
        title = item.get("title", "")
        url = item.get("url", "")
        output.append(f"{title}\n{url}\n")
    
    return "\n".join(output)

def main():
    parser = argparse.ArgumentParser(
        description="Brave Search API 客户端",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument("query", help="搜索关键词")
    parser.add_argument("-j", "--json", action="store_true", help="输出 JSON 格式（默认）")
    parser.add_argument("-t", "--text", action="store_true", help="输出纯文本格式")
    parser.add_argument("-s", "--simple", action="store_true", help="输出简化版文本格式")
    parser.add_argument("-c", "--count", type=int, default=5, help="返回结果数量（默认 5）")
    parser.add_argument("-o", "--offset", type=int, default=0, help="结果偏移量（分页）")
    
    args = parser.parse_args()
    
    if not args.query:
        parser.print_help()
        sys.exit(1)
    
    # 执行搜索
    print(f"🔍 搜索: {args.query}", file=sys.stderr)
    data = brave_search(args.query, count=args.count, offset=args.offset)
    
    if not data:
        print("搜索失败", file=sys.stderr)
        sys.exit(1)
    
    # 格式化输出
    if args.json:
        print(format_results_json(data, args.query))
    elif args.text:
        print(format_results_text(data))
    elif args.simple:
        print(format_results_simple(data))
    else:
        print(format_results_simple(data))

if __name__ == "__main__":
    main()
