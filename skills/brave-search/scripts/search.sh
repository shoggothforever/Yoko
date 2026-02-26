#!/bin/bash
# Brave Search 技能的便捷封装脚本
# 直接调用主脚本

SCRIPT_DIR="/root/.openclaw/workspace/scripts"
PYTHON_SCRIPT="$SCRIPT_DIR/brave-search.py"

if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "错误: 找不到 brave-search.py 脚本"
    exit 1
fi

python3 "$PYTHON_SCRIPT" "$@"
