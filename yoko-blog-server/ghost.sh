#!/bin/bash

# Ghost Chatroom 统一服务管理脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_PATH="$SCRIPT_DIR/scripts"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示Logo
show_logo() {
    echo -e "${CYAN}"
    cat << "EOF"
   ______ __               __ 
  / ____// /_   ____  _____/ /_
 / / __ / __ \ / __ \/ ___/ __/
/ /_/ // / / // /_/ (__  ) /_  
\____//_/ /_/ \____/____/\__/  
    Chatroom Service Manager
EOF
    echo -e "${NC}"
}

# 显示帮助信息
show_help() {
    show_logo
    echo -e "${GREEN}用法:${NC} ./ghost.sh [命令] [选项]"
    echo ""
    echo -e "${YELLOW}可用命令:${NC}"
    echo ""
    echo -e "  ${CYAN}start${NC}     启动服务"
    echo -e "  ${CYAN}stop${NC}      停止服务"
    echo -e "  ${CYAN}restart${NC}   重启服务"
    echo -e "  ${CYAN}status${NC}    查看服务状态"
    echo -e "  ${CYAN}logs${NC}      查看服务日志"
    echo -e "  ${CYAN}manage${NC}    进入完整管理界面"
    echo -e "  ${CYAN}help${NC}      显示此帮助信息"
    echo ""
    echo -e "${YELLOW}示例:${NC}"
    echo "  ./ghost.sh start          # 启动服务"
    echo "  ./ghost.sh status         # 查看状态"
    echo "  ./ghost.sh logs -f        # 实时查看日志"
    echo "  ./ghost.sh manage         # 交互式管理"
    echo ""
}

# 检查脚本是否存在
check_script() {
    local script_name=$1
    if [ ! -f "$SCRIPTS_PATH/$script_name" ]; then
        echo -e "${RED}❌ 脚本不存在: $script_name${NC}"
        exit 1
    fi
}

# 执行脚本
run_script() {
    local script_name=$1
    shift
    check_script "$script_name"
    bash "$SCRIPTS_PATH/$script_name" "$@"
}

# 主逻辑
case "${1:-help}" in
    start)
        show_logo
        echo -e "${GREEN}🚀 启动服务...${NC}"
        echo ""
        run_script "quick-start.sh"
        ;;
    
    stop)
        show_logo
        echo -e "${YELLOW}🛑 停止服务...${NC}"
        echo ""
        run_script "stop-service.sh"
        ;;
    
    restart)
        show_logo
        echo -e "${YELLOW}🔄 重启服务...${NC}"
        echo ""
        run_script "stop-service.sh"
        sleep 2
        run_script "quick-start.sh"
        ;;
    
    status)
        show_logo
        run_script "check-status.sh"
        ;;
    
    logs)
        shift
        LOG_FILE="$SCRIPT_DIR/logs/service.log"
        
        if [ "$1" = "-f" ] || [ "$1" = "--follow" ]; then
            echo -e "${CYAN}📋 实时查看日志... (Ctrl+C退出)${NC}"
            echo ""
            tail -f "$LOG_FILE"
        elif [ "$1" = "-n" ] && [ -n "$2" ]; then
            echo -e "${CYAN}📋 最近 $2 行日志:${NC}"
            echo ""
            tail -n "$2" "$LOG_FILE"
        else
            echo -e "${CYAN}📋 最近 50 行日志:${NC}"
            echo ""
            tail -n 50 "$LOG_FILE"
            echo ""
            echo -e "${YELLOW}提示:${NC}"
            echo "  实时查看: ./ghost.sh logs -f"
            echo "  查看N行:  ./ghost.sh logs -n 100"
        fi
        ;;
    
    manage)
        show_logo
        run_script "manage-service.sh"
        ;;
    
    help|--help|-h)
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
