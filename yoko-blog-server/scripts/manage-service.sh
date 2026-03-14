#!/bin/bash

# Ghost Chatroom 服务管理脚本

SERVICE_NAME="ghost-chatroom"
SERVICE_DIR="/root/.openclaw/workspace/yoko-blog-server"
LOG_FILE="$SERVICE_DIR/logs/service.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

check_service_installed() {
    if ! systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
        print_error "服务未安装，请先运行: sudo bash install-service.sh"
        exit 1
    fi
}

show_status() {
    print_status "检查服务状态..."
    echo ""
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_success "服务运行中"
        echo ""
        systemctl status $SERVICE_NAME --no-pager -l
        echo ""
        
        # 测试API
        print_status "测试API端点..."
        if curl -s http://localhost:3001/api/health > /dev/null; then
            print_success "API响应正常"
            curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || cat
        else
            print_warning "API无响应"
        fi
    else
        print_error "服务未运行"
        echo ""
        systemctl status $SERVICE_NAME --no-pager -l
    fi
}

start_service() {
    print_status "启动服务..."
    sudo systemctl start $SERVICE_NAME
    sleep 2
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_success "服务启动成功"
        show_status
    else
        print_error "服务启动失败"
        print_status "查看错误日志..."
        sudo journalctl -u $SERVICE_NAME -n 20 --no-pager
    fi
}

stop_service() {
    print_status "停止服务..."
    sudo systemctl stop $SERVICE_NAME
    sleep 1
    
    if ! systemctl is-active --quiet $SERVICE_NAME; then
        print_success "服务已停止"
    else
        print_error "服务停止失败"
    fi
}

restart_service() {
    print_status "重启服务..."
    sudo systemctl restart $SERVICE_NAME
    sleep 2
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_success "服务重启成功"
        show_status
    else
        print_error "服务重启失败"
        print_status "查看错误日志..."
        sudo journalctl -u $SERVICE_NAME -n 20 --no-pager
    fi
}

show_logs() {
    print_status "实时日志（Ctrl+C 退出）..."
    echo ""
    sudo journalctl -u $SERVICE_NAME -f
}

show_recent_logs() {
    local lines=${1:-50}
    print_status "显示最近 $lines 行日志..."
    echo ""
    sudo journalctl -u $SERVICE_NAME -n $lines --no-pager
}

enable_service() {
    print_status "启用开机自启..."
    sudo systemctl enable $SERVICE_NAME
    print_success "已设置为开机自启"
}

disable_service() {
    print_status "禁用开机自启..."
    sudo systemctl disable $SERVICE_NAME
    print_success "已禁用开机自启"
}

show_help() {
    cat << EOF
Ghost Chatroom 服务管理工具

用法: $0 <命令> [选项]

命令:
  status          显示服务状态
  start           启动服务
  stop            停止服务
  restart         重启服务
  logs [行数]     查看最近日志（默认50行）
  follow          实时跟踪日志
  enable          启用开机自启
  disable         禁用开机自启
  test            测试API端点
  help            显示此帮助信息

示例:
  $0 status              # 查看服务状态
  $0 restart             # 重启服务
  $0 logs 100            # 查看最近100行日志
  $0 follow              # 实时跟踪日志

服务信息:
  服务名称: $SERVICE_NAME
  工作目录: $SERVICE_DIR
  监听端口: 3001
  健康检查: http://localhost:3001/api/health

EOF
}

test_api() {
    print_status "测试API端点..."
    echo ""
    
    # Health check
    echo "1️⃣ 健康检查 /api/health"
    if curl -s http://localhost:3001/api/health > /dev/null; then
        print_success "响应正常"
        curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || cat
    else
        print_error "无响应"
    fi
    echo ""
    
    # Ghosts list
    echo "2️⃣ Ghost列表 /api/ghosts/active"
    if curl -s http://localhost:3001/api/ghosts/active > /dev/null; then
        print_success "响应正常"
        curl -s http://localhost:3001/api/ghosts/active | python3 -m json.tool 2>/dev/null | head -20 || cat
    else
        print_error "无响应"
    fi
    echo ""
    
    # Chat history
    echo "3️⃣ 讨论历史 /api/chat/history"
    if curl -s "http://localhost:3001/api/chat/history?limit=5" > /dev/null; then
        print_success "响应正常"
        curl -s "http://localhost:3001/api/chat/history?limit=5" | python3 -m json.tool 2>/dev/null | head -30 || cat
    else
        print_error "无响应"
    fi
    echo ""
}

# 主逻辑
case "$1" in
    status)
        check_service_installed
        show_status
        ;;
    start)
        check_service_installed
        start_service
        ;;
    stop)
        check_service_installed
        stop_service
        ;;
    restart)
        check_service_installed
        restart_service
        ;;
    logs)
        check_service_installed
        show_recent_logs ${2:-50}
        ;;
    follow)
        check_service_installed
        show_logs
        ;;
    enable)
        check_service_installed
        enable_service
        ;;
    disable)
        check_service_installed
        disable_service
        ;;
    test)
        test_api
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "未知命令: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
