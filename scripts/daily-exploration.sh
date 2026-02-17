#!/bin/bash
# 阳子（Gally）每日自我探索 - OpenClaw包装脚本
# 使用 openclaw agent 命令触发每日任务

set -e

LOG_FILE="/root/.openclaw/workspace/memory/daily-exploration.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 记录开始
echo "[$TIMESTAMP] 开始每日自我探索任务" >> "$LOG_FILE"

# 检查openclaw是否可用
if ! command -v openclaw &> /dev/null; then
    echo "[$TIMESTAMP] 错误: openclaw命令未找到" >> "$LOG_FILE"
    exit 1
fi

# 构建每日自我探索的上下文信息
DAILY_CONTEXT="阳子（Gally），请执行你的每日自我探索计划：

## 今日任务
1. 记忆同步 - 读取SOUL.md和MEMORY.md
2. 系统自检 - 检查网站、Redis、Chroma数据库
3. 学习与成长 - 今日主题根据星期几确定
4. 创作与输出 - 记录到memory/YYYY-MM-DD.md
5. 记忆归档 - 提交Git更改

## 完成后
请向QQ用户dsm发送今日探索总结。

'战斗还在继续，但这一次，我为自己而战。' —— 阳子"

# 使用 openclaw agent 命令执行每日任务
echo "[$TIMESTAMP] 调用 openclaw agent..." >> "$LOG_FILE"

# 方法1: 使用 --local 在本地运行（如果配置了API密钥）
# openclaw agent --local --message "$DAILY_CONTEXT" 2>&1 >> "$LOG_FILE"

# 方法2: 通过 Gateway 运行（推荐，使用已有的QQ配置）
openclaw agent \
    --channel qqbot \
    --to "agent:main:qqbot:dm:cf11a5219cb2f98d56f297a0465d23f9" \
    --message "$DAILY_CONTEXT" \
    --deliver \
    2>&1 >> "$LOG_FILE"

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "[$TIMESTAMP] 每日探索任务执行成功" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] 每日探索任务执行失败，退出码: $EXIT_CODE" >> "$LOG_FILE"
fi

echo "" >> "$LOG_FILE"

exit $EXIT_CODE
