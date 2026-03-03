#!/bin/bash
# 赛博朋克 Ghost 发现包装器
# 拦截输出，自动组织到日期目录

set -e

WORKSPACE="/root/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"
LEGACY_SCRIPT="$WORKSPACE/scripts/cyberpunk-ghost-discovery-legacy.sh"

# 日期和目录
DATE=$(date +%Y-%m-%d)
DAY_DIR="$MEMORY_DIR/ghost-discovery/$DATE"
mkdir -p "$DAY_DIR"

echo "========================================"
echo "📦 Ghost 发现包装器"
echo "========================================"
echo "📅 日期: $DATE"
echo "📂 输出目录: $DAY_DIR"
echo ""

# 检查原脚本是否存在
if [ ! -f "$LEGACY_SCRIPT" ]; then
    # 如果不存在，使用原路径
    LEGACY_SCRIPT="$WORKSPACE/scripts/cyberpunk-ghost-discovery.sh"
fi

# 运行原脚本，捕获输出
# 所有 echo 都会在这里被捕获
# sed 会重定向路径
bash "$LEGACY_SCRIPT" | while IFS= read -r line; do
    # 检测日志输出格式
    if echo "$line" | grep -q "^\[.*\]"; then
        # 这是日志行，保持原样
        echo "$line" | tee -a "$MEMORY_DIR/ghost-discovery.log"
        
    elif echo "$line" | grep -q "^📊 发现日志:"; then
        # 这是文件路径声明，重定向到日期目录
        echo "📊 发现日志: $DAY_DIR/$(date +%H_%M).log" | tee -a "$MEMORY_DIR/ghost-discovery.log"
        
    elif echo "$line" | grep -q "^📊 发现文档:"; then
        # 这是发现文档路径，重定向到日期目录
        LOG_FILE=$(echo "$line" | awk '{print $NF}')
        LOG_FILENAME=$(basename "$LOG_FILE")
        echo "📊 发现文档: $DAY_DIR/$LOG_FILENAME" | tee -a "$MEMORY_DIR/ghost-discovery.log"
        
        # 确保原文件移动到日期目录
        if [ -f "$LOG_FILE" ] && [ "$(dirname "$LOG_FILE")" != "$DAY_DIR" ]; then
            mv "$LOG_FILE" "$DAY_DIR/" 2>/dev/null
            echo "  📦 已移动: $LOG_FILENAME" | tee -a "$MEMORY_DIR/ghost-discovery.log"
        fi
        
    else
        # 其他输出，保持原样
        echo "$line"
    fi
done

echo ""
echo "========================================"
echo "✅ 包装器执行完成"
echo "========================================"
