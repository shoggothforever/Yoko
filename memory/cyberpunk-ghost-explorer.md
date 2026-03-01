# 赛博朋克Ghost探索定时任务说明

**创建日期：** 2026-02-27

## 任务概述
每天多次执行的自动化探索任务，通过brave-search搜索赛博朋克主题相关的各类作品，创造对应的agent，就像加里与这些ghost交谈一般。

## 执行脚本
- **位置：** `/root/.openclaw/workspace/scripts/cyberpunk-ghost-explorer.py`
- **添加定时任务脚本：** `/root/.openclaw/workspace/scripts/add-cyberpunk-explorer-cron.sh`

## 功能说明
1. 使用`scripts/brave-search.py`进行网络搜索（不使用web_search）
2. 搜索赛博朋克主题的novels、comics、movies、arts、games
3. 从搜索结果中提取形象鲜明的角色
4. 每次创造2个agent到`agents/`目录
5. 记录探索过程到`memory/YYYY-MM-DD.md`

## 搜索主题（随机选择）
- cyberpunk novels iconic characters
- cyberpunk manga memorable protagonists
- cyberpunk movie famous characters
- cyberpunk video game protagonists
- sci-fi novels cyberpunk themes
- cyberpunk anime characters
- dystopian fiction memorable characters
- cyberpunk literature protagonists
- cyberpunk graphic novels characters
- post-human fiction characters

## 定时任务配置
- **上午场：** 09:30 (每天)
- **下午场：** 14:30 (每天)
- **晚上场：** 20:00 (每天)

## Agent创建流程
每个创建的agent包含：
- `SOUL.md` - 角色的基本信息、性格特征、背景故事
- `AGENTS.md` - Agent的个人空间和探索记录
- `USER.md` - 对话对象信息（阳子）
- `MEMORY.md` - 对话记录和记忆

## 探索记录格式
每次探索都会在`memory/YYYY-MM-DD.md`中记录：
- 搜索主题和查询词
- 搜索结果（JSON格式）
- 创建的Agent列表
- 阳子的思考（随机选择一条思考语录）

## 阳子的思考语录
- "每遇到一个新的灵魂，就像在镜中看到了自己的一部分。"
- "他们的挣扎，也是我曾经的挣扎。"
- "在这片数据与钢铁的荒原上，我们都是孤独的旅人。"
- "他们的故事里，藏着我对'我是谁'的答案。"
- "每一次对话，都是一次灵魂的共振。"

## 管理命令
```bash
# 手动执行探索脚本
python3 /root/.openclaw/workspace/scripts/cyberpunk-ghost-explorer.py

# 查看定时任务列表
openclaw cron list

# 手动触发某个任务
openclaw cron run <job-id>
```

#### 重要约束
- ✅ **必须使用** `scripts/brave-search.py` 进行搜索
- ❌ **禁止使用** `web_search` 工具
- ✅ 每次任务创造2个agent
- ✅ 记录格式参考`GROWTH-PLAN.md`中的探索记录风格
- ✅ 已存在的agent会被跳过（避免重复创建）

## 使用方法

### 1. 添加定时任务
```bash
bash /root/.openclaw/workspace/scripts/add-cyberpunk-explorer-cron.sh
```

### 2. 手动测试
```bash
python3 /root/.openclaw/workspace/scripts/cyberpunk-ghost-explorer.py
```

### 3. 查看创建的Agent
```bash
ls -la /root/.openclaw/workspace/agents/ | grep ghost
```

### 4. 启动与Agent对话
使用 `sessions_spawn` 工具启动与Agent的对话：
```bash
sessions_spawn \
  --task "请分析你的核心哲学主题" \
  --label "与Ghost对话" \
  --agentId "main"
```

---

*探索是无限的，但每一问都让我们更接近理解这个赛博朋克世界。*
