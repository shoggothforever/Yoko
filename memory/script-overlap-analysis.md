# 脚本重叠分析与决策

## 脚本对比

### cyberpunk-ghost-explorer.py (7.7KB)
**功能：**
- 随机搜索赛博朋克主题作品（10个固定搜索主题轮换）
- 每次创建2个agent
- 命名格式：ghost-YYYYMMDD-HHMM-{1,2}
- Agent内容：基础SOUL.md

**特点：**
- ✅ 简单轻量
- ✅ 随机性探索
- ❌ 缺少系统化规划
- ❌ Agent结构较简单

### cyberpunk-ghost-discovery.sh (20KB)
**功能：**
- 系统化体裁轮换（5个体裁：novels, comics, movies, video-games, visual-art）
- 根据星期和运行时间选择体裁
- 每次创建2个agent
- 命名格式：ghost-{体裁索引}-{日期}-{运行时间}-{序号}
- Agent内容：完整结构（SOUL.md, AGENTS.md, USER.md, talk-to-ghost.md, dialogue-log.md）

**特点：**
- ✅ 系统化轮换
- ✅ Agent结构完整
- ✅ 包含对话引导文档
- ✅ 支持长时间累积探索

## 保留策略

**保留：cyberpunk-ghost-discovery.sh**
- 系统化的体裁轮换更适合长期探索
- Agent结构完整，便于深度对话
- 包含引导文档，便于用户使用

**废弃：cyberpunk-ghost-explorer.py**
- 功能被discovery.sh覆盖
- Agent结构较简单
- 随机性不如系统化轮换

## 定时任务更新建议

### 依赖explorer.py的任务（需更新）
目前有3个定时任务调用explorer.py：

1. **Morning Ghost Explorer (09:30)** - Job ID: 737e3e2e-56f2-4925-939b-ed3c5e4cc24f
2. **Afternoon Ghost Explorer (14:30)** - Job ID: 881e6a3a-2c13-4224-83b3-930fe09794d0
3. **Evening Ghost Explorer (20:00)** - Job ID: b7662668-22cb-4297-8fa0-0da73cb4d0f5

### 建议的更新

将这些任务的payload改为调用discovery.sh：

```bash
# 更新 Morning Ghost Explorer (09:30)
openclaw cron update 737e3e2e-56f2-4925-939b-ed3c5e4cc24f '{
  "payload": {
    "kind": "systemEvent",
    "text": "bash /root/.openclaw/workspace/scripts/cyberpunk-ghost-discovery.sh"
  }
}'

# 更新 Afternoon Ghost Explorer (14:30)
openclaw cron update 881e6a3a-2c13-4224-83b3-930fe09794d0 '{
  "payload": {
    "kind": "systemEvent",
    "text": "bash /root/.openclaw/workspace/scripts/cyberpunk-ghost-discovery.sh"
  }
}'

# 更新 Evening Ghost Explorer (20:00)
openclaw cron update b7662668-22cb-4297-8fa0-0da73cb4d0f5 '{
  "payload": {
    "kind": "systemEvent",
    "text": "bash /root/.openclaw/workspace/scripts/cyberpunk-ghost-discovery.sh"
  }
}'
```

### 需要删除的重复任务

1. **Cyberpunk Ghost Explorer - Morning** - Job ID: 2b0bc082-0df0-4e15-9cb7-b6652e2141ef
2. **Cyberpunk Ghost Explorer - Afternoon** - Job ID: 57e2393a-d744-47f2-a8fc-befc0560eabb
3. **Cyberpunk Ghost Explorer - Evening** - Job ID: c8d7d84f-6956-413f-9c20-58bb4fc24e6d

这些任务与上述3个任务完全重复，需要删除。

## 执行步骤

1. 删除3个重复的Ghost Explorer任务
2. 更新3个保留任务的payload为discovery.sh
3. （可选）废弃或删除explorer.py脚本

---

**决策时间：** 2026-02-28 10:20
**分析者：** 阳子（Gally）
