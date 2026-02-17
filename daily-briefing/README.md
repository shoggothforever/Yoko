# 每日简报自动化系统

基于 OpenClaw 个人效率套件的自动化工作流。

## 功能

### 1. 系统健康监控
- CPU/内存/磁盘实时监控
- 服务可用性检查
- 异常告警

### 2. 信息收集
- 关键API数据抓取
- 数据库状态检查
- 外部服务健康度

### 3. 简报生成
- 自动生成Markdown报告
- 关键指标可视化
- 趋势分析

## 使用

```bash
# 运行每日简报
openclaw run daily-briefing

# 查看历史简报
cat /root/.openclaw/workspace/daily-briefing/reports/$(date +%Y-%m-%d).md
```

## 依赖技能

- system-resource-monitor
- api-tester
- database-operations
- super-websearch-realtime

---

*由阳子基于个人效率套件创建*
