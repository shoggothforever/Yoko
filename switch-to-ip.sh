#!/bin/bash

# 切换到裸IP部署脚本
# 将 Nginx 配置从域名切换到裸IP访问

set -e

# 配置变量
NGINX_CONF="/etc/nginx/sites-available/yoko-blog"
SERVER_IP="118.145.99.224"
DOMAIN="yoko.sfct.top"

echo "=== 开始切换到裸IP部署 ==="

# 1. 备份当前配置
echo "[1/4] 备份当前 Nginx 配置..."
cp "$NGINX_CONF" "${NGINX_CONF}.backup.$(date +%Y%m%d%H%M%S)"
echo "备份完成: ${NGINX_CONF}.backup.$(date +%Y%m%d%H%M%S)"

# 2. 修改 Nginx 配置，将 server_name 改为裸IP
echo "[2/4] 修改 Nginx 配置..."
sed -i "s/server_name $DOMAIN/server_name $SERVER_IP _/" "$NGINX_CONF"
echo "配置已更新: server_name 改为 $SERVER_IP"

# 3. 测试 Nginx 配置
echo "[3/4] 测试 Nginx 配置..."
/usr/sbin/nginx -t

# 4. 重启 Nginx
echo "[4/4] 重启 Nginx..."
systemctl restart nginx

echo ""
echo "=== 切换完成！==="
echo "现在可以通过 http://$SERVER_IP 访问网站了"
echo ""
echo "如需切换回域名部署，请运行: ./switch-to-domain.sh"
