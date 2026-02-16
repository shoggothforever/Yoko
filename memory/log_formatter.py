#!/usr/bin/env python3
"""
Bot 日志格式化器 - Python版本
更可靠地处理JSON格式化，自动检测当前QQbot会话
"""

import json
import sys
from datetime import datetime
from pathlib import Path

# 颜色代码
COLORS = {
    'user': '\033[0;32m',
    'assistant': '\033[0;34m',
    'system': '\033[0;33m',
    'tool': '\033[0;35m',
    'info': '\033[0;36m',
    'reset': '\033[0m',
}

WORKSPACE = Path("/root/.openclaw/workspace")
SESSIONS_JSON = Path("/root/.openclaw/agents/main/sessions/sessions.json")


def get_qqbot_session_file():
    """从sessions.json中获取QQbot会话文件路径"""
    if not SESSIONS_JSON.exists():
        print(f"错误：sessions.json不存在: {SESSIONS_JSON}", file=sys.stderr)
        sys.exit(1)
    
    with open(SESSIONS_JSON, 'r') as f:
        sessions = json.load(f)
    
    # 查找QQbot会话
    for key, session in sessions.items():
        if 'qqbot' in key:
            session_file = session.get('sessionFile')
            if session_file:
                return Path(session_file)
    
    print("错误：未找到QQbot会话", file=sys.stderr)
    sys.exit(1)


def format_timestamp(ts):
    """格式化时间戳"""
    try:
        if isinstance(ts, str):
            # ISO格式
            dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
        elif isinstance(ts, (int, float)):
            # Unix时间戳
            dt = datetime.fromtimestamp(ts)
        else:
            return str(ts)
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return str(ts)


def extract_text(content):
    """从消息内容中提取纯文本"""
    if isinstance(content, str):
        try:
            # 尝试解析JSON字符串
            parsed = json.loads(content)
            return extract_text(parsed)
        except:
            return content
    elif isinstance(content, list):
        # 数组，提取所有type=text的元素
        texts = []
        for item in content:
            if isinstance(item, dict) and item.get('type') == 'text':
                texts.append(str(item.get('text', '')))
            elif isinstance(item, str):
                texts.append(item)
        return '\n'.join(texts)
    elif isinstance(content, dict):
        # 对象，尝试提取text字段
        if 'text' in content:
            return str(content['text'])
        elif 'content' in content:
            return extract_text(content['content'])
        else:
            return json.dumps(content, ensure_ascii=False)
    else:
        return str(content)


def format_line(line):
    """格式化单行JSON"""
    try:
        data = json.loads(line.strip())
    except json.JSONDecodeError:
        return line
    
    msg_type = data.get('type', '')
    timestamp = data.get('timestamp', '')
    time_str = format_timestamp(timestamp)
    
    if msg_type != 'message':
        # 非消息类型，简要显示
        return f"{COLORS['info']}[{time_str}] [系统] {msg_type}{COLORS['reset']}"
    
    # 解析消息
    message = data.get('message', {})
    role = message.get('role', '')
    
    # 提取内容
    content = message.get('content', '')
    text_content = extract_text(content)
    
    # 元数据
    model = message.get('model', '')
    provider = message.get('provider', '')
    usage = message.get('usage', {})
    input_tokens = usage.get('input', 0)
    output_tokens = usage.get('output', 0)
    total_tokens = usage.get('totalTokens', 0)
    tool_name = message.get('name', '')
    
    # 构建输出
    lines = []
    
    if role == 'user':
        lines.append(f"{COLORS['user']}[{time_str}] [用户]{COLORS['reset']}")
        for line in text_content.split('\n'):
            lines.append(f"  {line}")
    elif role == 'assistant':
        model_info = f" | {provider}/{model}" if model else ""
        token_info = ""
        if total_tokens:
            token_info = f" | 输入:{input_tokens} 输出:{output_tokens} 总计:{total_tokens}"
        lines.append(f"{COLORS['assistant']}[{time_str}] [助手]{model_info}{token_info}{COLORS['reset']}")
        for line in text_content.split('\n'):
            lines.append(f"  {line}")
    elif role == 'system':
        lines.append(f"{COLORS['system']}[{time_str}] [系统]{COLORS['reset']}")
        for line in text_content.split('\n'):
            lines.append(f"  {line}")
    elif role in ('tool', 'toolResult'):
        lines.append(f"{COLORS['tool']}[{time_str}] [工具] {tool_name}{COLORS['reset']}")
        for line in text_content.split('\n'):
            lines.append(f"  {line}")
    else:
        lines.append(f"{COLORS['info']}[{time_str}] [其他] {role}{COLORS['reset']}")
    
    return '\n'.join(lines) + '\n'


def main():
    import argparse
    import subprocess
    
    parser = argparse.ArgumentParser(description='Bot 日志格式化器')
    parser.add_argument('action', nargs='?', default='follow',
                       choices=['follow', 'cat', 'status', 'help'],
                       help='操作类型')
    parser.add_argument('-n', '--lines', type=int, default=20,
                       help='显示历史行数')
    parser.add_argument('-s', '--session', type=str, default='qqbot',
                       choices=['qqbot', 'main'],
                       help='指定会话类型（默认：qqbot）')
    
    args = parser.parse_args()
    
    if args.action == 'help':
        print("""Bot 日志格式化器使用方法：
  python log_formatter.py              - 实时跟踪QQbot会话（默认20条历史）
  python log_formatter.py -n 50        - 实时跟踪QQbot会话（50条历史）
  python log_formatter.py cat          - 显示QQbot全部日志
  python log_formatter.py status       - 显示上下文状态
  python log_formatter.py help         - 显示帮助
  
会话选择：
  -s qqbot    - 跟踪QQbot会话（默认）
  -s main     - 跟踪主会话
""")
        return
    
    if args.action == 'status':
        context_file = WORKSPACE / 'memory' / 'context-control.json'
        if context_file.exists():
            with open(context_file) as f:
                ctx = json.load(f)
            print(f"{COLORS['info']}=== 上下文控制: cwnd={ctx['cwnd']}, ssthresh={ctx['ssthresh']}, tokens={ctx['current_tokens']}, phase={ctx['phase']} ==={COLORS['reset']}")
        return
    
    # 获取会话文件
    SESSION_FILE = get_qqbot_session_file()
    
    if not SESSION_FILE.exists():
        print(f"错误：会话文件不存在: {SESSION_FILE}", file=sys.stderr)
        sys.exit(1)
    
    print(f"{COLORS['info']}跟踪会话: {SESSION_FILE.name}{COLORS['reset']}")
    
    if args.action == 'cat':
        print("=== Bot 会话日志（格式化）===")
        print()
        with open(SESSION_FILE, 'r') as f:
            for line in f:
                if line.strip():
                    print(format_line(line))
        return
    
    # follow 模式
    print("=== Bot 会话日志（实时跟踪）===")
    print("按 Ctrl+C 退出")
    print()
    
    # 先显示历史
    tail_cmd = ['tail', '-n', str(args.lines), str(SESSION_FILE)]
    result = subprocess.run(tail_cmd, capture_output=True, text=True)
    for line in result.stdout.splitlines():
        if line.strip():
            print(format_line(line))
    
    print(f"{COLORS['info']}--- 等待新消息 ---{COLORS['reset']}")
    print()
    
    # 实时跟踪
    try:
        tail_cmd = ['tail', '-n', '0', '-f', str(SESSION_FILE)]
        process = subprocess.Popen(tail_cmd, stdout=subprocess.PIPE, text=True, bufsize=1)
        for line in process.stdout:
            if line.strip():
                print(format_line(line), end='')
    except KeyboardInterrupt:
        print("\n退出")


if __name__ == '__main__':
    main()
