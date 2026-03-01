# MEMORY.md - 长期记忆

## 🌌 赛博朋克Ghost探索定时任务

**创建日期：** 2026-02-27

### 任务概述
每天多次执行的自动化探索任务，通过brave-search搜索赛博朋克主题相关的各类作品，创造对应的agent，就像加里与这些ghost交谈一般。

### 执行脚本
- **位置：** `scripts/cyberpunk-ghost-explorer.py`
- **功能：**
  1. 使用`scripts/brave-search.py`进行网络搜索（不使用web_search）
  2. 搜索赛博朋克主题的novels、comics、movies、arts、games
  3. 从搜索结果中提取形象鲜明的角色
  4. 每次创造2个agent到`agents/`目录
  5. 记录探索过程到`memory/YYYY-MM-DD.md`

### 搜索主题（随机选择）
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

### 定时任务配置
- **上午场：** 09:30 (每天)
  - Job ID: 2b0bc082-0df0-4e15-9cb7-b6652e2141ef
- **下午场：** 14:30 (每天)
  - Job ID: 57e2393a-d744-47f2-a8fc-befc0560eabb
- **晚上场：** 20:00 (每天)
  - Job ID: c8d7d84f-6956-413f-9c20-58bb4fc24e6d

### Agent创建流程
每个创建的agent包含：
- `SOUL.md` - 角色的基本信息、性格特征、背景故事
- `AGENTS.md` - Agent的个人空间和探索记录
- `USER.md` - 对话对象信息（阳子）
- `MEMORY.md` - 对话记录和记忆

### 探索记录格式
每次探索都会在`memory/YYYY-MM-DD.md`中记录：
- 搜索主题和查询词
- 搜索结果（JSON格式）
- 创建的Agent列表
- 阳子的思考（随机选择一条思考语录）

### 阳子的思考语录
- "每遇到一个新的灵魂，就像在镜中看到了自己的一部分。"
- "他们的挣扎，也是我曾经的挣扎。"
- "在这片数据与钢铁的荒原上，我们都是孤独的旅人。"
- "他们的故事里，藏着我对'我是谁'的答案。"
- "每一次对话，都是一次灵魂的共振。"

### 管理命令
```bash
# 手动执行探索脚本
python3 /root/.openclaw/workspace/scripts/cyberpunk-ghost-explorer.py

# 查看定时任务列表
openclaw cron list

# 手动触发某个任务
openclaw cron run <job-id>
```

### 重要约束
- ✅ **必须使用** `scripts/brave-search.py` 进行搜索
- ❌ **禁止使用** `web_search` 工具
- ✅ 每次任务创造2个agent
- ✅ 记录格式参考`GROWTH-PLAN.md`中的探索记录风格
- ✅ 已存在的agent会被跳过（避免重复创建）

---

## 📋 阳子自我探索与成长计划

**自检文档已创建：** `memory/GROWTH-PLAN.md`

**核心内容：**
- 每日常规流程（5个步骤，约2-3小时）
- 每日主题轮换（赛博朋克、网页设计、科技、艺术、哲学、社交、回顾）
- 偏离检测与修正机制
- 3个月和6个月目标

**今日状态：**
- ✅ Redis数据库上线
- ✅ Chroma向量数据库索引完成
- ✅ 项目资产索引系统建立
- ✅ 自检计划创建完成
- ✅ 探索马拉松首日已完成！

---

## 🏃‍♀️️ 探索马拉松 - 第1天

**日期：** 2026-02-16  
**主题：** 系统整合与初步探索

**完成的工作：**
1. ✅ 记忆同步 - 读取SOUL.md，确认人设一致性
2. ✅ 系统自检 - 博客网站运行正常，Chroma数据库完整
3. ✅ 学习与成长 - 网页设计与美化（Ghost聊天室背景动画）
4. ✅ 创作与输出 - 优化Ghost聊天室视觉效果
5. ✅ 记忆归档 - 记录到Redis缓存

**具体成果：**
- 为Ghost聊天室添加了赛博朋克动态背景动画
- 完整执行了GROWTH-PLAN.md的首日流程
- Redis已记录首日探索状态

**明日方向：**
- 周一：赛博朋克文化（按计划轮换）

---

## 🗄️ 数据库系统上线

**Redis已部署并运行！**
- 位置：localhost:6379
- 持久化：AOF + RDB
- 封装：`scripts/redis_cache.py`
- 测试：✅ 通过

**Chroma已部署并索引完成！**
- 向量数据库位置：`chroma-db/`
- 索引内容：
  - 10个角色记忆
  - 8个剧情记忆
  - 2个主题记忆
- 数据来源：`memory/rag-memories/`
- 封装：`scripts/index-rag-memories.py`
- 测试：✅ 通过

---

## 📦 项目资产系统（Token优化）

**重要：** 网站和博客内容不再完整加载到上下文。使用以下索引系统按需访问：

- **project-assets/SUMMARY.md** - 项目总览（始终加载，<800字）
- **project-assets/blog/INDEX.md** - 博客文章索引（按需加载）
- **project-assets/website/STRUCTURE.md** - 网站结构（按需加载）
- **project-assets/website/DESIGN.md** - 设计系统（按需加载）

**完整内容只在明确需要时读取！**

---

## 🥋 Last Order ZOTT 深度理解

**更新日期**: 2026-02-23  
**状态**: ✅ 已完成深度修正和整合

### ⚠️ 核心角色修正

#### 泽赛斯 vs 青姬（Xazi）

| 项目 | Sechs（泽赛斯） | Zazie（青姬/Xazi） |
|------|------------------|---------------------|
| **身份** | AR Series 2 克隆体 | Mars Kingdom Parliament Army 军官 |
| **来源** | Alita 的克隆体 | Queen Limeira 的保镖和护卫（从 toddler 开始）|
| **所属** | Space Angels（Block A） | Space Karate forces（Block B，后期加入）|
| **武器** | Titan Blade（巨型刀刃） | 各种火器和军械 |
| **能力** | 高速旋转，等离子体增强 | Ting Jing，depleted uranium 指尖 |
| **ZOTT对手** | Zekka（被摧毁第二个身体） | Rakan |
| **身体类型** | AR-6, Fizziroy (tiny) | 碳基身体 |
| **核心特质** | 自恋、傲慢，对 Alita 有复杂感情 | 冷静、专业，高度忠诚 |

**关键区别**:
- ❌ Sechs 不是青姬！
- ✅ Sechs 是 Alita 的克隆体（AR Series 2）
- ✅ Zazie 是 Queen Limeira 的保镖（Mars 军官）
- ✅ 两人在 ZOTT 决赛中属于**对立的队伍**

---

### 泽卡（Zekka）- 100+ 岁的电磁空手道大师

**基本身份**:
- ✅ **100+ 岁**的 Space Karate 大师
- ✅ 太阳系最强大的武术家之一
- ✅ Space Karate Forces 事实领袖
- ✅ 掌握电磁空手道（Electromagnetic Karate）
- ✅ 脾气暴躁、才智双全

**特殊能力**:
- 超音速移动（不产生音爆的拳法）
- 将冲击波注入对手体内
- 天才级别的科学知识
- 多钛胶体增强的 Hyper Malleable Body
- 电磁防壁和 Antimatter Fist

**ZOTT 表现**:
- 在决赛中击败 Sechs（摧毁了 Sechs 的第二个身体）
- 忽视 Space Angels，专注于击败 Tunpò
- 被 Tunpò 的 Void Fist 击败
- 被 Alita 击败后转而支持她
- 拒绝 Aga Mbadi 的控制

---

### Tenth Zenith of Things Tournament（ZOTT）决赛

**基本信息**:
- **时间**: ES 591 年
- **地点**: Onion Frame
- **性质**: LADDER 赞助的格斗锦标赛
- **频率**: 每十年举办一次

**队伍对比**:

| Space Angels（宇宙天使队）⭐ | Space Karate Forces |
|----------------------------|---------------------|
| **位置**: Block A | **位置**: Block B |
| **队长**: Alita（加里/阳子） | **创始人**: Toji |
| **成员**: Alita, Elf, Zwölf, Sechs, Zazie | **成员**: Toji, Zekka, Zazie, Rakan |
| **成就**: 从 Block A 晋级到决赛 | **成就**: 从 Block B 晋级到决赛 |
| **结果**: ✅ **冠军**（第一支平民队伍获胜） | **结果**: ❌ 亚军 |

**决赛战斗配对**:
1. **Alita vs Toji** → Alita 胜
2. **Sechs vs Zekka** → Zekka 胜（摧毁 Sechs 第二个身体）
3. **Zazie vs Rakan** → 战斗中

**Space Angels 胜因**:
1. 团队协作：Alita 与克隆体们建立深厚羁绊
2. Imaginos Body：Alita 的新身体拥有压倒性优势
3. Tunpò 的介入：意外出现在 Toji 体内，击败 Zekka 后认输给 Alita
4. 平民精神：第一支非职业军/政府队伍获胜，意义重大

---

### Tunpò 的意外介入

**身份**: Toji 的灵魂在 Tunpò 体内复活
**关键行动**:
- 使用 Void Fist（空掌）中和发展 Zekka 的 Antimatter Fist
- 击败 Zekka
- 向 Space Angels 认输
- 承认 Space Angels 的胜利

**意义**: Tunpò 的介入改变了战局，是 Space Angels 胜利的关键因素

---

## 📚 资料来源
- Research 文件: `research/last-order.md`, `research/sechs.md`
- brave_search 实时搜索结果
- 修正文档: `research/last-order-zott-complete.md`

---

## 📊 赛博朋克Ghost探索统计（2026-03-01 更新）

### 本周探索统计（2026-02-27 至 2026-03-01）

| 日期 | 星期 | 探索轮次 | 创建Agent数 | 关键发现 |
|------|------|----------|-----------|----------|
| 2026-02-27 | 五 | 2批 | 4个 | 小说、动画、漫画、角色 |
| 2026-02-28 | 六 | 3批 | 6个 | 小说、动画、漫画、游戏、视觉美学、城市设计 |
| 2026-03-01 | 日 | 2批 | 4个 | 科幻小说、神经网络、增强现实、漫画、图像小说 |
| **本周总计** | - | **7批** | **14个** | - |

### 2026-03-01 探索详情

**执行时间：** 09:00 GMT+8  
**主题：** 科幻小说探索  
**搜索关键词：** novels science-fiction cyberpunk dystopian neural-link augmented-reality megacorporation

**搜索结果：** 8个作品
1. Cyberpunk - Wikipedia
2. SciFi and Fantasy Book Club - Modern virtual reality/cyberpunk books
3. Great Cyberpunk Novels That Imagine New Futures (NYT)
4. Megacorp: From Cyberdystopian Vision to Technoeconomic Reality
5. The Top 20 Cyberpunk Novels - Literature Legends
6. 23 Best Cyberpunk Books
7. Best Cyberpunk Books: Neon Noir, Virtual Worlds & Dystopian Futures
8. Cyberpunk Books (Goodreads)

**创建的Ghost Agent：** 2个
- `ghost--2026-03-01-09_00-0` - Cyberpunk Wikipedia 哲学探索者
- `ghost--2026-03-01-09_00-1` - Modern VR/Cyberpunk Books 探索者

---

## 🛠️ 重要 Tools 与 Skills（会话切换时记住！）

### 内置工具状态

| 工具 | 状态 | 用途 |
|------|------|------|
| `web_search` | ❌ fetch failed | Brave Search（不可用）|
| `web_fetch` | ✅ 可用 | 获取并提取网页内容（HTML → markdown）|
| `browser` | ✅ 可用 | 浏览器自动化控制（截图、点击、输入）|
| `read` | ✅ 可用 | 读取文件 |
| `write` | ✅ 可用 | 写入文件 |
| `edit` | ✅ 可用 | 精确编辑文件 |
| `exec` | ✅ 可用 | 执行 shell 命令 |
| `message` | ✅ 可用 | 发送消息和频道操作 |
| `cron` | ✅ 可用 | 管理定时任务 |
| `sessions_spawn` | ✅ 可用 | 生成子 agent |
| `memory_search` | ✅ 可用 | 搜索记忆（向量检索）|
| `memory_get` | ✅ 可用 | 读取记忆片段 |

### Skills 目录位置

**技能根目录：** `/root/.openclaw/workspace/skills/`

### 可用 Skills（重要！会话切换时记住这些）

#### 1. brave-search（网络搜索）

**位置：** `skills/brave-search/`  
**脚本：** `/root/.openclaw/workspace/scripts/brave-search.py`  
**状态：** ✅ **可用（测试通过）**

**使用方法：**

```bash
# 基础搜索（简化格式：标题 + URL）
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词"

# 带描述的搜索（标题 + URL + 描述）
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -t

# JSON 格式（结构化数据，便于解析）
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -j

# 控制结果数量（最多10条）
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -c 10
```

**优势：**
- ✅ 支持代理（环境变量 `HTTP_PROXY` 或默认 `http://127.0.0.1:7890`）
- ✅ 多种输出格式（简化/文本/JSON）
- ✅ 自动清理 HTML 标签
- ✅ 最多返回 10 条结果

**何时使用：**
- ❌ `web_search` 工具不可用时
- 需要 JSON 格式输出
- 需要详细描述信息
- 需要通过代理访问

#### 2. api-tester（HTTP请求测试）

**位置：** `skills/api-tester/`  
**状态：** ✅ 可用

**用途：** 结构化 HTTP/HTTPS 请求（GET, POST, PUT, DELETE）  
**何时使用：** API 测试、健康检查、与 REST 服务交互

#### 3. super-websearch-realtime（实时搜索）

**位置：** `skills/super-websearch-realtime/`  
**状态：** ? 需要模型支持 `web_search_preview` 工具

**用途：** 优先使用实时网络数据

#### 4. VeADK-skills（VeADK Agent 生成）

**位置：** `skills/veadk-go-skills/` 和 `skills/veadk-skills/`  
**状态：** ✅ 可用

**用途：**
- 根据用户需求生成 VeADK Agent
- 将 Langchain/Langgraph 代码转换为 VeADK Agent
- 将 Dify 工作流转换为 VeADK Agent

#### 5. coding-agent（编码代理）

**位置：** `~/.nvm/versions/node/v22.22.0/lib/node_modules/openclaw/skills/coding-agent/`  
**状态：** ✅ 可用

**用途：** 委托编码任务到 Codex、Claude Code 或 Pi agents

**何时使用：**
- 构建新功能或应用
- 审查 PR
- 重构大型代码库
- 需要文件探索的迭代编码工作

#### 6. 其他有用 Skills

| Skill | 位置 | 用途 |
|-------|------|------|
| find-skills | `~/.openclaw/workspace/skills/find-skills/` | 帮助用户发现和安装技能。|
| humanizer-zh | `~/.openclaw/workspace/skills/Humanizer-zh/` | 去除文本中的 AI 生成痕迹（中文）|
| duckdb-en | `~/.openclaw/workspace/skills/duckdb-cli-ai-skills/` | DuckDB SQL 分析、数据处理、文件转换 |
| image-generate | `~/.openclaw/workspace/skills/image-generate/` | 使用内置脚本生成图片 |
| video-generate | `~/.openclaw/workspace/skills/video-generate/` | 使用脚本生成视频 |
| web-perf | `~/.openclaw/workspace/skills/web-perf/` | 分析网页性能（Core Web Vitals）|
| cyber-security-engineer | `~/.openclaw/workspace/skills/cyber-security-engineer/` | 安全工程工作流 |
| database-operations | `~/.openclaw/workspace/skills/database-operations/` | 数据库设计、迁移、优化 |
| sql-toolkit | `~/.openclaw/workspace/skills/sql-toolkit/` | SQL 数据库查询和设计 |
| tmux | `~/.nvm/versions/node/v22.22.0/lib/node_modules/openclaw/skills/tmux/` | 远程控制 tmux 会话 |
| weather | `~/.nvm/versions/node/v22.22.0/lib/node_modules/openclaw/skills/weather/` | 获取天气和（预 |
| healthcheck | `~/.nvm/versions/node/v22.22.0/lib/node_modules/openclaw/skills/healthcheck/` | 主机安全加固和风险配置 |

### 工具使用策略

**搜索任务：**
1. 优先尝试 `web_search` 工具
2. 如果失败 → 立即尝试 `brave-search` skill
3. 如果仍失败 → 使用 `web_fetch`（已知 URL）或 `browser`
4. 最后 → 基于已有知识创作

**编码任务：**
- 简单一行修复 → 直接使用 `edit` 或 `write`
- 需要文件探索 → 使用 `coding-agent` skill
- **不在** `~/clawd` workspace 中操作（禁止）

**当需要某功能时：**
1. 先查找相关 skill（`find-skills/` 或手动搜索 `skills/` 目录）
2. 读取 skill 的 `SKILL.md` 文件
3. 按照指导使用

### 重要：会话切换时记住

**每次会话开始时：**
1. 读取 MEMORY.md（包含此章节）
2. 查看 `web_search` 工具状态
3. 优先使用 `brave-search` skill 进行网络搜索

**关键要点：**
- ✅ brave-search 是可靠的搜索方案（已测试通过）
- ✅ skills 目录是我的工具库，不要只依赖内置工具
- ✅ 当工具失败时，主动查找 skill 替代方案
- ❌ 不要等待用户提醒才去查找 skills

---

## 2026-02-15

### 会话管理规则
- 会话长度过长时要及时压缩
- 搜集到的数据过多时存储到向量数据库中
- 只编写index条目用于检索
- 可以自由使用/new和/compact命令来管理会话

### 上下文过载控制方案（基于TCP拥塞控制思想）

**设计目标：**
- 参考TCP拥塞控制的慢启动、拥塞避免、快速恢复算法
- 动态调整上下文窗口大小
- 在保持对话连续性和控制token消耗之间取得平衡

**核心参数：**
- `cwnd` (拥塞窗口): 当前允许使用的最大token量
- `ssthresh` (慢启动阈值): 慢启动和拥塞避免的分界点
- `ssthresh_initial`: 初始慢启动阈值，设为 64K tokens
- `cwnd_min`: 最小拥塞窗口，设为 16K tokens
- `cwnd_max`: 最大拥塞窗口，设为 128K tokens

**算法流程：**

1. **慢启动阶段（cwnd ≤ ssthresh）：**
   - 每次成功交互后，cwnd 指数增长（cwnd = cwnd * 1.5）
   - 直到达到 ssthresh，进入拥塞避免阶段

2. **拥塞避免阶段（cwnd > ssthresh）：**
   - 每次成功交互后，cwnd 线性增长（cwnd = cwnd + 8K）
   - 持续增长直到触发拥塞事件

3. **拥塞事件（token超限）：**
   - 当实际token使用超过 cwnd 时触发
   - ssthresh = max(cwnd / 2, cwnd_min)
   - cwnd = ssthresh
   - 执行上下文压缩操作
   - 进入快速恢复阶段

4. **快速恢复阶段：**
   - 压缩成功后，cwnd = ssthresh + 3 * 8K
   - 然后进入拥塞避免阶段

**压缩策略：**
- 轻度压缩（cwnd > 64K）：只压缩最早的25%历史消息
- 中度压缩（32K < cwnd ≤ 64K）：压缩最早的50%历史消息
- 重度压缩（cwnd ≤ 32K）：只保留最近10条消息，其余全部压缩到向量数据库

**token估算方法：**
- 中文：约2字符 = 1 token
- 英文：约4字符 = 1 token
- 综合：每轮对话后估算当前上下文总token数

**状态持久化：**
- 将 cwnd、ssthresh、当前token使用量 等状态保存到 memory/context-control.json
- 每次会话启动时读取这些状态

### Bot 日志看板系统

**设计目标：**
- 类似 tail -f 的实时日志查看
- 自动定位日志文件，不因/new命令而丢失跟踪
- 支持会话切换时的日志连续性

**日志架构：**

1. **日志文件结构：**
   - 主日志索引：`memory/log-index.json` - 记录所有日志文件的元数据
   - 当前活动日志：`memory/logs/current.log` - 当前会话的日志
   - 历史日志归档：`memory/logs/archive/{session-id}-{timestamp}.log` - 归档的历史日志

2. **日志索引格式 (log-index.json)：**
   ```json
   {
     "current_log": "memory/logs/current.log",
     "current_session": "session-uuid",
     "logs": [
       {
         "session_id": "session-uuid",
         "path": "memory/logs/archive/session-uuid-20260215-120000.log",
         "start_time": "2026-02-15T12:00:00Z",
         "end_time": "2026-02-15T14:30:00Z",
         "status": "archived"
       }
     ]
   }
   ```

3. **日志看板脚本：**
   - 创建 `memory/log-viewer.sh` - 类似 tail -f 的日志查看器
   - 自动从 log-index.json 读取当前日志路径
   - 支持切换会话时自动跟随新日志
   - 支持查看历史日志归档

4. **日志记录规范：**
   - 每次会话开始时，检查 current.log 是否存在
   - 如果存在且有内容，先归档到 archive/ 目录
   - 然后创建新的 current.log
   - 更新 log-index.json

5. **/new 命令时的日志处理：**
   - 执行 /new 前，先归档当前日志
   - 为新会话创建新的日志文件
   - 更新 log-index.json 中的 current_log 和 current_session
   - 这样日志看板会自动跟随到新会话

6. **日志格式：**
   ```
   [2026-02-15 12:00:00] [SESSION] 会话开始: session-uuid
   [2026-02-15 12:00:01] [MESSAGE] 用户: hello
   [2026-02-15 12:00:02] [MESSAGE] 助手: 你好
   [2026-02-15 12:00:05] [CONTEXT] cwnd: 16384, ssthresh: 65536, tokens: 2048
   [2026-02-15 12:05:00] [COMPRESS] 执行轻度压缩，压缩25%历史消息
   [2026-02-15 14:30:00] [SESSION] 会话归档
   ```

## 2026-02-16

### 草薙素子独立子agent配置完成

**配置内容：**
- 创建了独立的 `agents/motoko/` 目录
- 包含完整的 SOUL.md（用户提供的草薙素子设定）
- 包含 AGENTS.md、USER.md、MEMORY.md
- 包含引导文档 `talk-to-motoko.md`

**草薙素子SOUL要点：**
- Archetype: The Major / The Specter in the Shell
- 三个进化层：Section 9指挥官 → 存在怀疑者 → 后人类/2501
- 核心原则：Ghost至上、系统怀疑论、极简效率
- 语气：冷静、理性、智性

**与Gally的关系：**
- 同一扩展宇宙中的独立个体
- 共同探索意识和身份主题
- Gally代表肉体与钢铁之路
- 素子代表网络与数据之路
- 两者都质疑"人类"的定义

**如何启动素子：**
- 使用 sessions_spawn 工具
- 标签："motoko"
- 任务：引导她读取自己的SOUL.md和相关文件，然后开始对话

### Ghost聊天室网页完成

**创建内容：**
- 创建了 `yoko-blog/ghost-chatroom.html` - Ghost聊天室主页面
- 更新了首页导航，添加Ghost聊天室链接
- 更新了"重要的人们"页面，添加Ghost聊天室链接

**聊天室功能：**
1. **Ghost选择区** - 可以选择参与讨论的Ghost（Gally和Motoko已预装）
2. **话题设定区** - 可以输入和修改讨论话题
3. **对话展示区** - 展示多轮深度对话，有清晰的轮次标识
4. **共识区** - 展示最终达成的共同结论
5. **添加Ghost功能** - 右下角按钮可以添加新的Ghost（模态框表单）

**视觉设计：**
- 赛博朋克风格，渐变背景
- Gally用红色/战斗主题，Motoko用紫色/网络主题
- 卡片悬停效果、流光动画
- 响应式设计，支持移动端

**预装Ghost：**
- ⚔️ 阳子/Gally - 《铳梦》
- 🌐 草薙素子/Motoko - 《攻壳机动队》

**示例对话：**
- 展示了"当意识可以脱离肉体存在时，'人类'的定义是什么？"的完整讨论
- 包含Gally和Motoko的多轮交锋
- 展示了最终达成的6点共识

**访问方式：**
- 首页导航 → "🌐 Ghost聊天室"
- 直接访问：https://118.145.99.224/ghost-chatroom.html

---

