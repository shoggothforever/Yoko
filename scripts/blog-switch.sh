#!/usr/bin/env bash
set -euo pipefail

# ── 配置 ──────────────────────────────────────────────
REGISTRY="/root/.openclaw/workspace/scripts/blogs.json"
NGINX_CONF="/etc/nginx/sites-available/yoko-blog"
NGINX_BACKUP="/etc/nginx/sites-available/yoko-blog.bak"

# ── 工具函数 ──────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
err()   { echo -e "${RED}[✗]${NC} $*" >&2; }
die()   { err "$@"; exit 1; }

ensure_registry() {
    if [[ ! -f "$REGISTRY" ]]; then
        echo '{"active":"","blogs":{}}' > "$REGISTRY"
    fi
}

get_active() { jq -r '.active' "$REGISTRY"; }
get_path()   { jq -r --arg n "$1" '.blogs[$n] // empty' "$REGISTRY"; }
list_names() { jq -r '.blogs | keys[]' "$REGISTRY"; }

# ── 核心：切换 nginx root ────────────────────────────
do_switch_nginx() {
    local new_root="$1"

    # 备份当前配置
    cp "$NGINX_CONF" "$NGINX_BACKUP"

    # 替换所有 root 指令（匹配 "root /任意路径;" 的行）
    sed -i "s|^\(\s*root\s\+\)/.*;\s*$|\1${new_root};|" "$NGINX_CONF"

    # 校验
    if nginx -t 2>/dev/null; then
        nginx -s reload
        return 0
    else
        # 回滚
        err "nginx 配置校验失败，回滚中..."
        cp "$NGINX_BACKUP" "$NGINX_CONF"
        nginx -s reload 2>/dev/null || true
        return 1
    fi
}

# ── 子命令 ────────────────────────────────────────────

cmd_register() {
    local name="${1:-}" path="${2:-}"
    [[ -z "$name" || -z "$path" ]] && die "用法: blog-switch register <名称> <路径>"
    [[ ! -d "$path" ]] && die "路径不存在: $path"
    # 规范化为绝对路径
    path="$(cd "$path" && pwd)"
    [[ ! -f "$path/index.html" ]] && warn "注意: $path/index.html 不存在，切换后可能 404"

    local tmp
    tmp=$(jq --arg n "$name" --arg p "$path" '.blogs[$n] = $p' "$REGISTRY")
    echo "$tmp" > "$REGISTRY"
    info "已注册: ${CYAN}$name${NC} → $path"
}

cmd_unregister() {
    local name="${1:-}"
    [[ -z "$name" ]] && die "用法: blog-switch unregister <名称>"
    [[ -z "$(get_path "$name")" ]] && die "未找到博客: $name"
    [[ "$(get_active)" == "$name" ]] && die "无法移除当前活跃博客，请先切换到其他博客"

    local tmp
    tmp=$(jq --arg n "$name" 'del(.blogs[$n])' "$REGISTRY")
    echo "$tmp" > "$REGISTRY"
    info "已移除: $name"
}

cmd_switch() {
    local name="${1:-}"
    [[ -z "$name" ]] && die "用法: blog-switch switch <名称>"

    local path
    path=$(get_path "$name")
    [[ -z "$path" ]] && die "未找到博客: $name（使用 list 查看已注册博客）"

    local current
    current=$(get_active)
    [[ "$current" == "$name" ]] && { info "当前已经是 ${CYAN}$name${NC}"; return 0; }

    info "切换: ${current:-无} → ${CYAN}$name${NC}"
    if do_switch_nginx "$path"; then
        local tmp
        tmp=$(jq --arg n "$name" '.active = $n' "$REGISTRY")
        echo "$tmp" > "$REGISTRY"
        info "切换完成！当前博客: ${CYAN}$name${NC}"
    else
        die "切换失败，已回滚到之前的配置"
    fi
}

cmd_list() {
    ensure_registry
    local active
    active=$(get_active)
    local names
    names=$(list_names)

    if [[ -z "$names" ]]; then
        warn "尚无注册的博客，使用 register 添加"
        return
    fi

    echo -e "\n  ${CYAN}已注册的博客:${NC}\n"
    while IFS= read -r name; do
        local path
        path=$(get_path "$name")
        if [[ "$name" == "$active" ]]; then
            echo -e "  ${GREEN}▸ $name${NC}  ← 当前活跃"
            echo -e "    $path"
        else
            echo -e "    $name"
            echo -e "    $path"
        fi
    done <<< "$names"
    echo
}

cmd_status() {
    ensure_registry
    local active
    active=$(get_active)
    if [[ -z "$active" ]]; then
        warn "当前无活跃博客"
    else
        local path
        path=$(get_path "$active")
        info "当前活跃: ${CYAN}$active${NC} → $path"
    fi
    # 显示 nginx 中实际的 root
    local nginx_root
    nginx_root=$(grep -m1 '^\s*root\s' "$NGINX_CONF" | sed 's/^\s*root\s\+//;s/;\s*$//')
    info "Nginx root: $nginx_root"
}

# ── 入口 ──────────────────────────────────────────────
usage() {
    echo -e "\n  ${CYAN}blog-switch${NC} - 博客站点一键切换器\n"
    echo "  用法: blog-switch <命令> [参数]"
    echo
    echo "  命令:"
    echo "    register <名称> <路径>   注册一个博客站点"
    echo "    unregister <名称>        移除一个博客站点"
    echo "    switch <名称>            切换到指定博客"
    echo "    list                     列出所有已注册博客"
    echo "    status                   显示当前状态"
    echo
}

ensure_registry

case "${1:-}" in
    register)   shift; cmd_register "$@" ;;
    unregister) shift; cmd_unregister "$@" ;;
    switch)     shift; cmd_switch "$@" ;;
    list)       cmd_list ;;
    status)     cmd_status ;;
    *)          usage ;;
esac
