#!/bin/bash

# Ghost Chatroom 快速启动脚本 (无需 systemd)

SERVICE_DIR="/root/.openclaw/workspace/yoko-blog-server"
LOG_DIR="$SERVICE_DIR/logs"
PID_FILE="$SERVICE_DIR/ghost-chatroom.pid"

cd "$SERVICE_DIR" || exit 1

echo "=== Ghost Chatroom 启动器 ==="
echo ""

# 检查是否已运行
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "⚠️  服务已在运行 (PID: $OLD_PID)"
        echo ""
        echo "测试API："
        curl -s http://localhost:3001/api/health && echo "" || echo "❌ API无响应"
        exit 0
    else
        echo "清理旧的PID文件..."
        rm -f "$PID_FILE"
    fi
fi

# 创建日志目录
mkdir -p "$LOG_DIR"

# 启动服务
echo "🚀 启动服务..."
nohup node src/index.js > "$LOG_DIR/service.log" 2>&1 &
PID=$!

# 保存PID
echo $PID > "$PID_FILE"

# 等待启动
sleep 3

# 检查是否成功
if kill -0 "$PID" 2>/dev/null; then
    echo "✅ 服务启动成功！"
    echo ""
    echo "进程ID: $PID"
    echo "监听地址: http://0.0.0.0:3001"
    echo "外网访问: http://118.145.99.224:8080/api/"
    echo ""
    
    # 测试API
    echo "测试健康检查..."
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ API响应正常"
        curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || cat
    else
        echo "❌ API无响应"
    fi
    echo ""
    
    echo "查看日志: tail -f $LOG_DIR/service.log"
    echo "停止服务: kill $PID 或 bash stop-service.sh"
else
    echo "❌ 服务启动失败"
    echo ""
    cat "$LOG_DIR/service.log"
    rm -f "$PID_FILE"
    exit 1
fi
