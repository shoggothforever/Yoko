#!/bin/bash
# openclaw每日定时任务执行脚本
# 通过openclaw命令行触发定时任务

set -e

LOG_FILE="/root/.openclaw/workspace/memory/openclaw-daily-task.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] 开始执行openclaw每日定时任务..." >> "$LOG_FILE"

# 检查openclaw是否安装
if ! command -v openclaw &> /dev/null; then
    echo "[$DATE] 错误：openclaw命令未找到" >> "$LOG_FILE"
    exit 1
fi

echo "[$DATE] openclaw版本：$(openclaw --version)" >> "$LOG_FILE"

# 执行每日自我探索任务
echo "[$DATE] 触发每日自我探索..." >> "$LOG_FILE"

# 使用cron工具触发任务
openclaw cron run 96b0c089-98c6-4c9a-a2e2-93df9e727681 2>&1 >> "$LOG_FILE" || {
    echo "[$DATE] 警告：cron run命令失败，尝试使用wake..." >> "$LOG_FILE"
    
    # 尝试使用wake唤醒
    openclaw cron wake "开始今天的自我探索！" 2>&1 >> "$LOG_FILE" || {
        echo "[$DATE] 错误：所有触发方式都失败了" >> "$LOG_FILE"
        exit 1
    }
}

echo "[$DATE] 每日定时任务执行完成" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

exit 0
