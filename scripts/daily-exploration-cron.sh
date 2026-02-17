#!/bin/bash
# 阳子每日自我探索 - Crontab版本
# 简化包装，用于定时任务

LOG="/root/.openclaw/workspace/memory/cron-daily.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Cron任务触发" >> "$LOG"

# 调用主脚本
/root/.openclaw/workspace/scripts/daily-exploration.sh >> "$LOG" 2>&1

echo "[$DATE] Cron任务完成，退出码: $?" >> "$LOG"
echo "" >> "$LOG"
