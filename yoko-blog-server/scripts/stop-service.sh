#!/bin/bash

# Ghost Chatroom 停止脚本

SERVICE_DIR="/root/.openclaw/workspace/yoko-blog-server"
PID_FILE="$SERVICE_DIR/ghost-chatroom.pid"

echo "=== Ghost Chatroom 停止器 ==="
echo ""

if [ ! -f "$PID_FILE" ]; then
    echo "⚠️  找不到PID文件，服务可能未运行"
    
    # 尝试查找进程
    PIDS=$(pgrep -f "node.*src/index.js")
    if [ -n "$PIDS" ]; then
        echo "找到运行中的进程: $PIDS"
        read -p "是否停止这些进程? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill $PIDS
            echo "✅ 进程已停止"
        fi
    fi
    exit 0
fi

PID=$(cat "$PID_FILE")

if kill -0 "$PID" 2>/dev/null; then
    echo "停止服务 (PID: $PID)..."
    kill "$PID"
    
    # 等待进程退出
    for i in {1..10}; do
        if ! kill -0 "$PID" 2>/dev/null; then
            echo "✅ 服务已停止"
            rm -f "$PID_FILE"
            exit 0
        fi
        sleep 1
    done
    
    # 强制停止
    echo "⚠️  正常停止超时，强制终止..."
    kill -9 "$PID" 2>/dev/null
    rm -f "$PID_FILE"
    echo "✅ 服务已强制停止"
else
    echo "⚠️  进程不存在，清理PID文件"
    rm -f "$PID_FILE"
fi
