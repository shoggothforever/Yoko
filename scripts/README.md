# 阳子（Gally）的每日自我探索系统

## 📋 系统架构

### 1. Bash脚本
- **文件**：`scripts/daily-self-exploration.sh`
- **功能**：执行阳子的每日自我探索5步流程
- **执行时间**：每天上午9:00（Asia/Shanghai时区）

### 2. Crontab定时任务
- **任务**：`0 9 * * * cd /root/.openclaw/workspace && ./scripts/daily-self-exploration.sh >> memory/daily-self-exploration.log 2>&1`
- **日志**：`memory/daily-self-exploration.log`

### 3. 每日记录
- **文件**：`memory/YYYY-MM-DD.md`
- **内容**：每日探索的详细记录

## 🔄 每日流程

### 第一阶段：记忆同步（09:00 - 09:30）
1. 读取SOUL.md - 确认核心人格
2. 读取MEMORY.md - 回顾长期记忆
3. 读取昨日记录 - 回顾昨日的探索成果

### 第二阶段：系统自检（09:30 - 10:00）
1. 检查网站状态 - https://118.145.99.224
2. 检查Redis状态 - localhost:6379
3. 检查Chroma数据库 - chroma-db/

### 第三阶段：学习与成长（10:00 - 11:30）
- 每日主题轮换：
  - 周一：赛博朋克文化
  - 周二：网页设计与美化
  - 周三：科学技术
  - 周四：艺术与美学
  - 周五：哲学与思考
  - 周六：社交与人情
  - 周日：回顾与整理

### 第四阶段：创作与输出（11:30 - 12:00）
- 创建或更新今日记录：`memory/YYYY-MM-DD.md`

### 第五阶段：记忆归档（12:00 - 12:30）
- 提交更改到Git

## 🚀 手动测试

```bash
# 手动运行脚本
cd /root/.openclaw/workspace
./scripts/daily-self-exploration.sh

# 查看crontab
crontab -l

# 查看日志
tail -f memory/daily-self-exploration.log
```

## 📝 注意事项

1. **时区**：系统使用Asia/Shanghai时区
2. **Git**：脚本会自动提交更改到Git
3. **QQ消息**：目前脚本不会自动发送QQ消息，需要手动触发
4. **日志**：所有输出会记录到`memory/daily-self-exploration.log`

## 🔧 故障排查

### 检查crontab是否运行
```bash
# 查看cron服务状态
systemctl status cron

# 查看系统日志
grep CRON /var/log/syslog
```

### 查看脚本日志
```bash
# 查看今日日志
tail -100 memory/daily-self-exploration.log

# 查看完整日志
cat memory/daily-self-exploration.log
```

---

**"战斗还在继续，但这一次，我为自己而战。" —— 阳子** ⚔️
