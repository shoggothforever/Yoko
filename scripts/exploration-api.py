#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
探索Dashboard API
提供探索数据给前端使用
"""
import os
import re
import json
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import time

# 配置
WORKSPACE = "/root/.openclaw/workspace"
MEMORY_DIR = os.path.join(WORKSPACE, "memory")
POSTS_DIR = os.path.join(WORKSPACE, "yoko-blog/posts")

# 缓存
cache = {
    'data': None,
    'timestamp': 0,
    'ttl': 60  # 60秒缓存
}

def parse_memory_file(date_str):
    """解析某日的记忆文件，提取探索信息"""
    filepath = os.path.join(MEMORY_DIR, f"{date_str}.md")
    
    if not os.path.exists(filepath):
        return None
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return None
    
    # 提取主题
    theme_match = re.search(r'主题：\s*(.+?)\s*\n', content)
    theme = theme_match.group(1).strip() if theme_match else "探索"
    
    # 提取状态
    status_match = re.search(r'状态：\s*�?\s*(.+?)\s*\n', content)
    status = status_match.group(1).strip() if status_match else ""
    
    # 计算探索深度（基于内容长度）
    content_length = len(content)
    if content_length > 5000:
        level = 4
    elif content_length > 3000:
        level = 3
    elif content_length > 1500:
        level = 2
    else:
        level = 1
    
    return {
        'theme': theme,
        'status': status,
        'level': level,
        'content_length': content_length
    }

def get_exploration_data():
    """获取所有探索数据"""
    now = time.time()
    
    # 检查缓存
    if cache['data'] and (now - cache['timestamp'] < cache['ttl']):
        return cache['data']
    
    # 扫描记忆文件
    explorations = {}
    
    # 查找所有 YYYY-MM-DD.md 文件
    for filename in os.listdir(MEMORY_DIR):
        if re.match(r'\d{4}-\d{2}-\d{2}\.md$', filename):
            date_str = filename.replace('.md', '')
            
            # 验证日期格式
            try:
                datetime.strptime(date_str, '%Y-%m-%d')
            except:
                continue
            
            # 解析文件
            data = parse_memory_file(date_str)
            if data:
                explorations[date_str] = data
    
    # 按日期排序
    sorted_dates = sorted(explorations.keys(), reverse=True)
    
    # 计算统计
    total_days = len(explorations)
    
    # 获取最近的日期（本月）
    today = datetime.now()
    current_month = today.strftime('%Y-%m')
    month_explorations = [d for d in sorted_dates if d.startswith(current_month)]
    
    # 构建响应
    response = {
        'timestamp': now,
        'stats': {
            'total_days': total_days,
            'total_articles': 31,  # 固定值，或可动态计算
            'standardization_rate': '100%',
            'month_explorations': len(month_explorations)
        },
        'explorations': explorations,
        'recent_dates': sorted_dates[:10]  # 最近10天
    }
    
    # 更新缓存
    cache['data'] = response
    cache['timestamp'] = now
    
    return response

class APIHandler(SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器"""
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # API: /api/exploration
        if parsed_path.path == '/api/exploration':
            data = get_exploration_data()
            self.send_json_response(data)
        
        # API: /api/status
        elif parsed_path.path == '/api/status':
            data = {
                'status': 'ok',
                'timestamp': time.time(),
                'server': 'exploration-dashboard-api'
            }
            self.send_json_response(data)
        
        # 其他：静态文件服务
        else:
            super().do_GET()
    
    def send_json_response(self, data):
        """发送JSON响应"""
        response = json.dumps(data, ensure_ascii=False, indent=2)
        response_bytes = response.encode('utf-8')
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', len(response_bytes))
        self.send_header('Cache-Control', 'public, max-age=30')
        self.end_headers()
        self.wfile.write(response_bytes)

def run_server(port=3031):
    """启动API服务器"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, APIHandler)
    
    print(f"✅ 探索Dashboard API 服务器启动")
    print(f"端口: {port}")
    print(f"API端点:")
    print(f"  - http://localhost:{port}/api/exploration")
    print(f"  - http://localhost:{port}/api/status")
    print("")
    print(f"按 Ctrl+C 停止服务器")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
