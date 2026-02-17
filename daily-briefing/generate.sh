#!/bin/bash
# 每日简报生成脚本
# 由个人效率套件驱动

set -e

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)
REPORT_DIR="/root/.openclaw/workspace/daily-briefing/reports"
REPORT_FILE="$REPORT_DIR/$DATE.md"

mkdir -p "$REPORT_DIR"

echo "🚀 生成 $DATE 的每日简报..."

# 开始生成报告
cat > "$REPORT_FILE" << EOF
# 📊 每日简报 - $DATE

**生成时间**: $TIME  
**生成者**: 阳子个人效率套件

---

## 🖥️ 系统健康状态

### 资源使用
EOF

# 获取系统资源信息
echo "📊 收集系统资源数据..."
{
    echo ""
    echo "**CPU负载**:"
    uptime | awk -F'load average:' '{print "- 1分钟: " $2}' | cut -d',' -f1
    uptime | awk -F'load average:' '{print "- 5分钟: " $2}' | cut -d',' -f2
    uptime | awk -F'load average:' '{print "- 15分钟: " $2}' | cut -d',' -f3
    
    echo ""
    echo "**内存使用**:"
    free -h | grep "Mem:" | awk '{print "- 已用: " $3 " / 总计: " $2 " (" $3/$2*100 "%)"}'
    free -h | grep "Swap:" | awk '{print "- Swap: " $3 " / " $2}'
    
    echo ""
    echo "**磁盘使用**:"
    df -h / | tail -1 | awk '{print "- 根分区: " $3 " / " $2 " (" $5 " 已用)"}'
    
    echo ""
    echo "**系统运行时间**:"
    uptime -p 2>/dev/null || uptime | awk -F',' '{print $1}'
    
} >> "$REPORT_FILE"

# 添加服务状态部分
cat >> "$REPORT_FILE" << EOF

---

## 🔧 关键服务状态

EOF

# 检查关键服务
echo "🔍 检查关键服务..."
{
    # 检查网站
    if curl -s -k -o /dev/null -w "%{http_code}" https://118.145.99.224 | grep -q "200"; then
        echo "- ✅ 网站 (https://118.145.99.224): 正常运行"
    else
        echo "- ❌ 网站: 异常"
    fi
    
    # 检查Redis
    if systemctl is-active redis-server > /dev/null 2>&1; then
        echo "- ✅ Redis: 运行中"
    else
        echo "- ❌ Redis: 未运行"
    fi
    
    # 检查Nginx
    if systemctl is-active nginx > /dev/null 2>&1; then
        echo "- ✅ Nginx: 运行中"
    else
        echo "- ❌ Nginx: 未运行"
 fi
    
    # 检查OpenClaw Gateway
    if systemctl is-active openclaw-gateway > /dev/null 2>&1 || pgrep -f "openclaw-gateway" > /dev/null; then
        echo "- ✅ OpenClaw Gateway: 运行中"
    else
        echo "- ⚠️ OpenClaw Gateway: 状态未知"
    fi
    
} >> "$REPORT_FILE"

# 添加总结部分
cat >> "$REPORT_FILE" << EOF

---

## 📈 今日建议

基于当前系统状态：

EOF

# 生成建议
{
    # 检查磁盘使用率
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 80 ]; then
        echo "- ⚠️ **磁盘空间紧张**: 已使用 ${DISK_USAGE}%，建议清理日志或大文件"
    else
        echo "- ✅ 磁盘空间充足: ${DISK_USAGE}% 已用"
    fi
    
    # 检查内存
    MEM_INFO=$(free | grep Mem)
    MEM_TOTAL=$(echo $MEM_INFO | awk '{print $2}')
    MEM_USED=$(echo $MEM_INFO | awk '{print $3}')
    MEM_PERCENT=$((MEM_USED * 100 / MEM_TOTAL))
    
    if [ "$MEM_PERCENT" -gt 85 ]; then
        echo "- ⚠️ **内存使用率较高**: ${MEM_PERCENT}%，可能需要优化或扩容"
    else
        echo "- ✅ 内存使用正常: ${MEM_PERCENT}%"
    fi
    
    # CPU负载检查
    LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}' | xargs)
    CPU_CORES=$(nproc 2>/dev/null || echo 4)
    LOAD_PERCENT=$(awk "BEGIN {printf \"%.0f\", ($LOAD_AVG / $CPU_CORES) * 100}")
    
    if [ "$LOAD_PERCENT" -gt 80 ]; then
        echo "- ⚠️ **CPU负载较高**: ${LOAD_PERCENT}% (负载: $LOAD_AVG / ${CPU_CORES}核)"
    else
        echo "- ✅ CPU负载正常: ${LOAD_PERCENT}%"
    fi
    
    # 总体健康评分
    ISSUES=0
    [ "$DISK_USAGE" -gt 80 ] && ISSUES=$((ISSUES + 1))
    [ "$MEM_PERCENT" -gt 85 ] && ISSUES=$((ISSUES + 1))
    [ "$LOAD_PERCENT" -gt 80 ] && ISSUES=$((ISSUES + 1))
    
    echo ""
    if [ "$ISSUES" -eq 0 ]; then
        echo "### 🟢 系统健康评分: 100/100"
        echo "所有指标正常，系统运行良好！"
    elif [ "$ISSUES" -eq 1 ]; then
        echo "### 🟡 系统健康评分: 75/100"
        echo "系统基本正常，但有一个指标需要注意。"
    else
        echo "### 🔴 系统健康评分: $((100 - ISSUES * 25))/100"
        echo "系统有 $ISSUES 个指标需要关注和优化。"
    fi
    
} >> "$REPORT_FILE"

# 添加结尾
cat >> "$REPORT_FILE" << EOF

---

## 📌 备注

- 此报告由 **阳子个人效率套件** 自动生成
- 生成时间: $TIME
- 数据来源: 本地系统监控 + 服务健康检查

---

*保持高效，保持好奇 🚀*
EOF

echo "✅ 每日简报已生成: $REPORT_FILE"
echo ""
echo "📊 简报预览:"
echo "=============================="
head -50 "$REPORT_FILE"
