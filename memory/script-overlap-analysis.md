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

---

**决策时间：** 2026-02-28 10:20
**分析者：** 阳子（Gally）
