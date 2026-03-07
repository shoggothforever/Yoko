#!/bin/bash
# 检查所有应用服务状态

echo "========================================"
echo "   应用服务状态检查"
echo "========================================"

services=(
    "ghost-chatroom-server:Ghost Chatroom Server (后端):3000"
    "nova-chaos:Nova Consciousness Chaos (Next.js):3001"
    "ghost-chatroom-vue:Ghost Chatroom Vue (前端):3002"
)

echo ""
for service_info in "${services[@]}"; do
    IFS=':' read -r name desc port <<< "$service_info"
    
    echo "📦 $name"
    echo "   描述: $desc"
    echo "   端口: $port"
    
    # 检查 systemd 服务状态
    if systemctl is-active --quiet "$name.service"; then
        echo "   状态: ✅ 运行中"
        uptime=$(systemctl show "$name.service" -p ActiveEnterTimestamp --value | cut -d' ' -f1-2)
        echo "   运行时间: $uptime"
    else
        echo "   状态: ❌ 未运行"
        if systemctl is-failed --quiet "$name.service"; then
            echo "   错误: 服务启动失败"
            echo "   最近日志:"
            journalctl -u "$name.service" -n 3 --no-pager | sed 's/^/     /'
        fi
    fi
    
    # 检查端口
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        echo "   端口: ✅ 监听中"
    else
        echo "   端口: ❌ 未监听"
    fi
    
    echo ""
done

echo "========================================"
echo "   日志目录"
echo "========================================"
echo ""
echo "📁 ghost-chatroom-server: /var/log/ghost-chatroom-server/"
echo "📁 nova-chaos: /var/log/nova-chaos/"
echo "📁 ghost-chatroom-vue: /var/log/ghost-chatroom-vue/"

echo ""
echo "========================================"
echo "   快捷命令"
echo "========================================"
echo ""
echo "查看日志:"
echo "  journalctl -u ghost-chatroom-server.service -f"
echo "  journalctl -u nova-chaos.service -f"
echo "  journalctl -u ghost-chatroom-vue.service -f"
echo ""
echo "重启服务:"
echo "  systemctl restart ghost-chatroom-server"
echo "  systemctl restart nova-chaos"
echo "  systemctl restart ghost-chatroom-vue"
echo ""
echo "启动所有:"
echo "  bash /root/.openclaw/workspace/scripts/start-all-services.sh"
echo ""
echo "检查状态:"
echo "  bash /root/.openclaw/workspace/scripts/check-services.sh"
