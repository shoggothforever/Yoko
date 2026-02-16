#!/bin/bash
# Bot 日志看板 - 调用Python版本
# Python版本更可靠地处理JSON格式化

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/log_formatter.py"

# 检查Python脚本是否存在
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "错误：Python脚本不存在: $PYTHON_SCRIPT"
    exit 1
fi

# 调用Python脚本
python3 "$PYTHON_SCRIPT" "$@"
