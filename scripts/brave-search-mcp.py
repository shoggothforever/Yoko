#!/usr/bin/env python3
"""
Brave Search MCP Server
使用 stdio 协议提供 Brave Search API 功能
"""

import json
import sys
import os
import requests
import re
from datetime import datetime

# 配置
API_KEY = os.environ.get("BRAVE_API_KEY", "BSAhDW5RKnOEVqcaX4hrRyqeisac70O")
API_URL = "https://api.search.brave.com/res/v1/web/search"

def brave_search(query, count=10, offset=0):
    """调用 Brave Search API"""
    proxy = os.environ.get("HTTP_PROXY", "http://127.0.0.1:7890")
    
    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": API_KEY
    }
    
    params = {
        "q": query,
        "count": count,
        "offset": offset,
        "textDecorations": "false",
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
        return {"error": str(e)}

def clean_html(text):
    """移除 HTML 标签"""
    if not text:
        return ""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def handle_search(params):
    """处理搜索请求"""
    query = params.get("query", "")
    count = params.get("count", 10)
    offset = params.get("offset", 0)
    
    if not query:
        return {"error": "Query parameter is required"}
    
    data = brave_search(query, count, offset)
    
    if "error" in data:
        return data
    
    web_results = data.get("web", {}).get("results", [])
    
    formatted_results = []
    for item in web_results:
        formatted_results.append({
            "title": item.get("title", ""),
            "url": item.get("url", ""),
            "description": clean_html(item.get("description", item.get("snippet", "")))[:300],
            "source": item.get("profile", {}).get("name", "Brave Search")
        })
    
    return {
        "query": query,
        "total_results": len(formatted_results),
        "timestamp": datetime.now().isoformat(),
        "results": formatted_results
    }

def handle_request(request):
    """处理 MCP 请求"""
    method = request.get("method", "")
    
    if method == "initialize":
        return {
            "protocolVersion": "2024-11-05",
            "capabilities": {
                "tools": {}
            },
            "serverInfo": {
                "name": "brave-search",
                "version": "1.0.0"
            }
        }
    
    elif method == "tools/list":
        return {
            "tools": [
                {
                    "name": "brave_search",
                    "description": "Search the web using Brave Search API. Returns web search results with title, URL, and description.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "The search query string"
                            },
                            "count": {
                                "type": "number",
                                "description": "Number of results to return (default: 10, max: 20)",
                                "default": 10
                            },
                            "offset": {
                                "type": "number",
                                "description": "Offset for pagination (default: 0)",
                                "default": 0
                            }
                        },
                        "required": ["query"]
                    }
                }
            ]
        }
    
    elif method == "tools/call":
        tool_name = request.get("params", {}).get("name")
        arguments = request.get("params", {}).get("arguments", {})
        
        if tool_name == "brave_search":
            result = handle_search(arguments)
            return {
                "content": [
                    {
                        "type": "text",
                        "text": json.dumps(result, ensure_ascii=False, indent=2)
                    }
                ]
            }
        else:
            return {"error": f"Unknown tool: {tool_name}"}
    
    else:
        return {"error": f"Unknown method: {method}"}

def main():
    """MCP stdio 主循环"""
    for line in sys.stdin:
        try:
            request = json.loads(line)
            response = handle_request(request)
            
            # MCP 响应格式
            result = {
                "jsonrpc": "2.0",
                "id": request.get("id"),
                "result": response
            }
            
            print(json.dumps(result), flush=True)
            
        except json.JSONDecodeError:
            error_response = {
                "jsonrpc": "2.0",
                "id": None,
                "error": {
                    "code": -32700,
                    "message": "Parse error"
                }
            }
            print(json.dumps(error_response), flush=True)
        except Exception as e:
            error_response = {
                "jsonrpc": "2.0",
                "id": request.get("id") if 'request' in locals() else None,
                "error": {
                    "code": -32603,
                    "message": str(e)
                }
            }
            print(json.dumps(error_response), flush=True)

if __name__ == "__main__":
    main()
