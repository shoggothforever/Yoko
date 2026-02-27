#!/bin/bash

# Ghost Chatroom Server 一键启动脚本

SERVER_DIR="/root/.openclaw/workspace/yoko-blog-server"
SERVER_LOG="$SERVER_DIR/server.log"

echo "=== Ghost Chatroom Server 启动脚本 ==="
echo ""

# 检查服务器是否已经在运行
if pgrep -f "node.*src/index.js" > /dev/null 2>&1; then
    echo "⚠️  服务器已经在运行中"
    echo ""
    echo "当前进程信息："
    pgrep -f "node.*src/index.js" | head -1
    echo ""
    echo "服务器健康检查："
    curl -s http://localhost:8080/api/health && echo "✅ 服务器正常响应" || echo "❌ 服务器无响应"
    echo ""
else
    echo "🚀 启动Ghost Chatroom服务器..."
    echo ""

    # 进入服务器目录
    cd "$SERVER_DIR" || {
        echo "❌ 无法进入服务器目录: $SERVER_DIR"
        exit 1
    }

    # 启动服务器
    nohup node src/index.js > "$SERVER_LOG" 2>&1 &
    SERVER_PID=$!

    # 等待服务器启动
    echo "等待服务器启动... (5秒)"
    sleep 5

    # 检查服务器是否成功启动
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "✅ 服务器启动成功！(PID: $SERVER_PID)"
        echo ""
        echo "=== 服务器信息 ==="
        echo "进程ID: $SERVER_PID"
        echo "监听地址: http://localhost:8080"
        echo "健康检查: http://localhost:8080/api/health"
        echo "前端页面: http://localhost:8080/ghost-chatroom.html"
        echo ""
        echo "=== 测试API端点 ==="
        echo ""

        # 测试健康检查
        if curl -s http://localhost:8080/api/health; then
            echo "✅ 健康检查端点正常"
            curl -s http://localhost:8080/api/health | python3 -m json.tool
        else
            echo "❌ 健康检查端点无响应"
        fi
        echo ""

        # 测试获取Ghost列表
        if curl -s http://localhost:8080/api/ghosts/active; then
            echo "✅ Ghost列表端点正常"
        else
            echo "❌ Ghost列表端点无响应"
        fi
        echo ""

        echo "=== 最近日志 ==="
        tail -20 "$SERVER_LOG"
        echo ""
        echo "=== 后台运行中... ==="
        echo "使用以下命令查看实时日志："
        echo "  tail -f $SERVER_LOG"
        echo ""
        echo "使用以下命令停止服务器："
        echo "  kill $SERVER_PID"
        echo ""
    else
        echo "❌ 服务器启动失败"
        echo ""
        echo "=== 错误日志 ==="
        cat "$SERVER_LOG"
        exit 1
    fi
fi
