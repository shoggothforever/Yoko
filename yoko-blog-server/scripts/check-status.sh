#!/bin/bash

# Ghost Chatroom 服务状态检查

SERVICE_DIR="/root/.openclaw/workspace/yoko-blog-server"
PID_FILE="$SERVICE_DIR/ghost-chatroom.pid"

echo "=== Ghost Chatroom 状态 ==="
echo ""

# 检查PID文件
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "✅ 服务运行中"
        echo "   进程ID: $PID"
        echo "   内存使用: $(ps -p $PID -o rss= | awk '{printf "%.1f MB", $1/1024}')"
        echo "   CPU使用: $(ps -p $PID -o %cpu= | awk '{print $1"%"}')"
        echo "   运行时间: $(ps -p $PID -o etime= | xargs)"
    else
        echo "❌ 服务未运行（PID文件存在但进程不存在）"
        exit 1
    fi
else
    echo "❌ 服务未运行"
    exit 1
fi

echo ""
echo "=== API 测试 ==="
echo ""

# 测试健康检查
echo "1️⃣ 健康检查 /api/health"
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "   ✅ 正常"
    curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null | head -10
else
    echo "   ❌ 无响应"
fi

echo ""
echo "2️⃣ Ghost列表 /api/ghosts/active"
if curl -s http://localhost:3001/api/ghosts/active > /dev/null; then
    echo "   ✅ 正常"
else
    echo "   ❌ 无响应"
fi

echo ""
echo "3️⃣ 讨论历史 /api/chat/history"
if curl -s "http://localhost:3001/api/chat/history?limit=3" > /dev/null; then
    echo "   ✅ 正常"
    RECORDS=$(curl -s "http://localhost:3001/api/chat/history?limit=3" | python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data.get('data', {}).get('records', [])))" 2>/dev/null)
    if [ -n "$RECORDS" ]; then
        echo "   共有 $RECORDS 条历史记录"
    fi
else
    echo "   ❌ 无响应"
fi

echo ""
echo "=== 外网访问 ==="
echo "   http://118.145.99.224:8080/api/health"
echo "   http://118.145.99.224:8080/ghost-chatroom.html"
echo ""
