#!/bin/bash
# 设置每日简报定时任务

CRON_JOB="0 8 * * * /root/.openclaw/workspace/daily-briefing/generate.sh >> /root/.openclaw/workspace/daily-briefing/cron.log 2>&1"

echo "🕐 设置每日简报定时任务..."
echo "执行时间: 每天早上 8:00"
echo "执行脚本: /root/.openclaw/workspace/daily-briefing/generate.sh"
echo "日志位置: /root/.openclaw/workspace/daily-briefing/cron.log"
echo ""

# 检查是否已存在相同的cron任务
if crontab -l 2>/dev/null | grep -q "daily-briefing/generate.sh"; then
    echo "⚠️  定时任务已存在，跳过设置"
    echo ""
    echo "当前crontab中的每日简报任务:"
    crontab -l | grep "daily-briefing"
else
    # 添加新的cron任务
    (crontab -l 2>/dev/null; echo ""; echo "# 每日简报自动生成"; echo "$CRON_JOB") | crontab -
    echo "✅ 定时任务设置成功！"
    echo ""
    echo "验证 - 当前crontab内容:"
    crontab -l | tail -5
fi

echo ""
echo "📋 管理命令:"
echo "  查看所有定时任务: crontab -l"
echo "  编辑定时任务: crontab -e"
echo "  删除定时任务: crontab -r"
echo "  立即运行简报: /root/.openclaw/workspace/daily-briefing/generate.sh"
echo "  查看执行日志: tail -f /root/.openclaw/workspace/daily-briefing/cron.log"
