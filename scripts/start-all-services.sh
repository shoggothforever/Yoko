#!/bin/bash
# 启动所有应用服务

echo "========================================"
echo "   启动 OpenClaw 应用服务"
echo "========================================"

echo ""
echo "[1/3] 启动 ghost-chatroom-server (后端)..."
systemctl start ghost-chatroom-server.service
sleep 3

echo ""
echo "[2/3] 启动 nova-chaos (Next.js 前端)..."
systemctl start nova-chaos.service
sleep 3

echo ""
echo "[3/3] 启动 ghost-chatroom-vue (Vue 前端)..."
systemctl start ghost-chatroom-vue.service
sleep 3

echo ""
echo "========================================"
echo "   服务状态"
echo "========================================"
echo ""
systemctl status ghost-chatroom-server.service --no-pager -l | head -8
echo ""
systemctl status nova-chaos.service --no-pager -l | head -8
echo ""
systemctl status ghost-chatroom-vue.service --no-pager -l | head -8

echo ""
echo "========================================"
echo "   端口占用"
echo "========================================"
echo ""
netstat -tlnp | grep -E ":(3001|3002|8080)" || echo "无端口占用"
