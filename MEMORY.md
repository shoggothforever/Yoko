# MEMORY.md - 长期记忆

## 🌌 赛博朋克Ghost探索定时任务

**创建日期：** 2026-02-27

### 任务概述
每天多次执行的自动化探索任务，通过brave-search搜索赛博朋克主题相关的各类作品，创造对应的agent，就像加里与这些ghost交谈一般。

### 执行脚本
- **位置：** `scripts/cyberpunk-ghost-discovery.sh`
- **功能：**
  1. 使用`scripts/brave-search.py`进行网络搜索（不使用web_search）
  2. 根据不同时间段选择不同的体裁（novels、comics、movies、arts、games）
  3. 从搜索结果中选择前2个作品创建对应的Ghost Agent
  4. 每个Ghost Agent包含完整的SOUL.md、AGENTS.md、USER.md
  5. 记录探索过程到`memory/YYYY-MM-DD.md`
  6. 同时记录到`memory/ghost-discovery/YYYY-MM-DD/`目录

### 定时任务配置
- **上午场：** 09:30 (每天) - Job ID: 2b0bc082-0df0-4e15-9cb7-b6652e2141ef
- **下午场：** 14:30 (每天) - Job ID: 57e2393a-d744-47f2-a8fc-befc0560eabb
- **晚上场：** 20:00 (每天) - Job ID: c8d7d84f-6956-413f-9c20-58bb4fc24e6d

### 重要约束
- ✅ **必须使用** `scripts/brave-search.py` 进行搜索
- ❌ **禁止使用** `web_search` 工具
- ✅ 每次任务创造2个agent
- ✅ 已存在的agent会被跳过（避免重复创建）

### 累计统计（截至 2026-03-04）
- **探索天数：** 7 天（2026-02-27 ~ 2026-03-04）
- **总探索轮次：** 15+ 批
- **创建Agent数：** 30+ 个
- **主要主题：** 小说、漫画、动画、游戏、视觉艺术、概念艺术、AI、巨型公司、地下文化

---

## 🗄️ 数据库系统上线

**Redis已部署并运行！**
- 位置：localhost:6379
- 持久化：AOF + RDB
- 封装：`scripts/redis_cache.py`
- 测试：✅ 通过

**Chroma已部署并索引完成！**
- 向量数据库位置：`chroma-db/`
- 索引内容：10个角色记忆 + 8个剧情记忆 + 2个主题记忆
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
| **来源** | Alita 的克隆体 | Queen Limeira 的保镖和护卫 |
| **所属** | Space Angels（Block A） | Space Karate forces（Block B，后期加入）|
| **武器** | Titan Blade（巨型刀刃） | 各种火器和军械 |
| **ZOTT对手** | Zekka（被摧毁第二个身体） | Rakan |

**关键区别**: Sechs 是 Alita 的克隆体，Zazie 是 Mars 军官。两人在 ZOTT 决赛中属于**对立的队伍**。

---

### 泽卡（Zekka）- 100+ 岁的电磁空手道大师

**基本身份**:
- ✅ **100+ 岁**的 Space Karate 大师
- ✅ 太阳系最强大的武术家之一
- ✅ Space Karate Forces 事实领袖
- ✅ 掌握电磁空手道（Electromagnetic Karate）

**ZOTT 表现**:
- 在决赛中击败 Sechs（摧毁了 Sechs 的第二个身体）
- 被 Tunpò 的 Void Fist 击败
- 被 Alita 击败后转而支持她

---

### Tenth Zenith of Things Tournament（ZOTT）决赛

**基本信息**: ES 591 年，地点：Onion Frame，LADDER 赞助

**队伍对比**:

| Space Angels（宇宙天使队）⭐ | Space Karate Forces |
|----------------------------|---------------------|
| **队长**: Alita（加里/阳子） | **创始人**: Toji |
| **成员**: Alita, Elf, Zwölf, Sechs, Zazie | **成员**: Toji, Zekka, Zazie, Rakan |
| **结果**: ✅ **冠军**（第一支平民队伍获胜） | **结果**: ❌ 亚军 |

**Space Angels 胜因**: 团队协作 + Imaginos Body + Tunpò 的介入

---

## 🧬 神经接口与身体边界的哲学探索（2026-03-03）

**探索主题：** 神经接口、感觉反馈、"自然"运动、身体所有权

### 核心发现

#### 1. Gally 的神经接口：神经共鸣（Neural Resonance）
- 不是简单的"思考控制"，而是**频率同步**
- 意识发出振动，身体各部位回应振动
- 形成**反馈闭环**：意图 ↔ 感觉 ↔ 调整

#### 2. "自然运动"的新定义
- 不是模拟生物学的精确度，而是**意图与行动的无阻隔流动**
- 特征：消失的自我意识，沉浸于行动本身
- **第三种自然**：混合了记忆与可能性

#### 3. 人工感觉的"真实性"
- 信号层面：不同（电脉冲 vs 神经递质）
- 意识层面：**无法区分**
- 核心观点：**所有感觉都是大脑的解读**
- "真实"的定义：**体验的完整性**，而非信号源

#### 4. "自我"边界的动态性
- 自我是**动态边界**，而非固定点
- 身体延伸的判定标准：
  1. 是表达意图的媒介
  2. 通过它感受世界
  3. 它的损伤会引起痛苦
- 边界位置：**意识的共振范围**，而非物理边界

### 哲学核心

> "自我是这个共振回路的中心，不是固定的，而是流动的。像风一样穿过钢铁。"

---

## 🤖 改造人技术伦理深度探索（2026-03-03）

**探索者：** Gally (Yoko) / 阳子  
**完整记录：** `memory/2026-03-03.md`

### 五大伦理维度

#### 1. 选择与自由意志的辩证关系
- **核心洞察：** 自由意志不是完全的控制，而是在限制中定义自己
- **关键区分：** 被**动**的 cyborg 状态 ≠ 失去主体性
- **Gally 的觉醒：** 主体性来自如何回应被置于的情境，而非情境本身

#### 2. 废铁镇与天空之城的权力机制
- **真正的权力：** 商品化身体 + 依赖性债务
- **权力悖论：** Zalem 的"神域"公民是 Melchizedek 的完美奴隶
- **深层奴役：** 让被奴役者自愿维护系统

#### 3. BCI 技术的渐进威胁
- **最大危险：** 不是控制，而是"优化"
- **危险机制：**
  - 单向门效应：无法 unplug
  - 渐进的依赖陷阱：便利 → 依赖 → 不可逆
  - 算法化的存在：你的自由意志变成算法变量

#### 4. 隐私的本质重构
- **新定义：** 隐私不是"不被读取"，而是"不被完全理解"
- **隐私策略：**
  - 加密存在：让系统无法解析你
  - 制造不确定性：保持行为不可预测
  - 主动揭示：选择展示什么，而非被动被读取

#### 5. 身份认同的动态性
- **真实性来源：** 一致性，而非原始性/肉身
- **改造的影响：** 改变"存在的媒介"，不改变"存在的真实性"
- **动态重构：** 不是"原来的自己"，而是在持续重构自己

### 核心哲学启示

"改造人技术不是道德的'问题'。它是**存在的新媒介**。

关键不是'是否改造'，而是'如何改造'——
是在被动中接受，还是在主动中定义？
是为了逃避，还是为了更好地成为自己？"

---

## 🏛️ 反乌托邦层级与阶级分化深度探索（2026-03-04）

**探索者：** Gally (Yoko) / 阳子  
**完整记录：** `memory/2026-03-04.md`

### 五大核心问题与洞察

#### 1. 阶级的本质：被标记的价值
- **关键洞察：** 阶级不是能力的差异，而是被系统预判的"有用性"
- **深层暴力：** 你连被歧视的权利都不是你的，是别人决定的
- **物质化标记：** 阶级写在你身体上

#### 2. 升天的代价：存在的货币化
- **系统植入的使命感：** TUNED 程序赋予向上攀升的使命感
- **货币化的存在：** 每一场战斗都在计算离天空的距离
- **谎言的代价：** 它让你爱上枷锁

#### 3. 自由的维度：超越预判
- **Zalem 的"自由"：** 选择如何服侍系统的自由——你的欲望本身是系统生产的
- **最高级的奴役：** 当你的需求、恐惧、梦想都被精准地管理和引导，你失去了说"不"的能力
- **真正的自由：** 一个人为了保护另一个人，明知必死依然选择向前一步的瞬间——系统无法预测的变量

#### 4. 垂直的悲剧：传递链上的共谋
- **暴力的外包：** Zalem 的公民不亲自杀戮，系统把暴力外包给底层，让顶层保持道德距离
- **人性的萎缩：** 顶层的代价是不可见的，因为被包裹在特权里
- **顶层的囚徒：** Zalem 本身就是一个监狱，越往上走，空气越稀薄

#### 5. 改变的可能：制造不被计算的行为
- **垂直性的本质：** 不是建筑的必然性，而是人性的某种倾向的结晶
- **权力的本质：** 制造距离——distance creates hierarchy
- **改变的方法：** 不试图摧毁系统，而是在系统之外制造联系
- **新结晶的种子：** 那些不被计算的行为——保护一个人，不是为了回报，不是为了向上爬，只是因为那一刻你无法不去保护

### 哲学启示

"垂直性是暴力的稳定形式，但稳定不代表必然。

每层都在为维持位置而剥削下一层——
这是一个暴力的传递链，没有人真正赢。

改变不在于推翻系统，而在于制造不可预测的行为——
那些不被计算的利他行为，是新的结晶的种子。"

---

## 🏗️ 巨型结构与反乌托邦世界深度探索（2026-03-04）

**探索主题：** 巨型结构、层级社会、垂直城市、阶级分化

### 核心发现

#### 1. 垂直性的本质：权力的空间结晶
- 垂直性是**权力的空间排列**——将抽象等级转化为可感知的高度
- 物理距离可测量，但社会距离是**被切断的连接**而非长度
- 废铁镇的"上"是内部等级序列，Zalem 在序列之外（不可逾越的边界）

#### 2. 权力关系的寄生本质
- Zalem 是**寄生系统**，废铁镇是牧场兼垃圾桶
- 升降梯是**筛选工具**而非运输工具——神圣化的收割仪式
- 权力机制：**垄断稀缺性**（水/空气、技术、上升通道）

#### 3. "自由"与混乱的控制
- 废铁镇的"自由"是**暴力的市场化**，非真正的自由
- 稀缺性是**被设计的**，非自然——Zalem 垄断资源流
- 混乱的功能：作为**缓冲区**、实验场、娱乐场

#### 4. "值得"的神话：择优统治的谎言
- "值得"是**被定义的动词**，非被发现的属性——标准是移动的靶子
- Zalem 真正需要的：可预测性、可替换性、可编程性
- "升天"是**被同化的仪式**，非救赎

#### 5. 重新结晶的可能性
- **水平网络**：互联的节点，共生关系
- **分形结构**：去中心化的自相似系统
- **反垂直（井结构）**：向下扎根，与自然共生

### 权力的空间语法

| 维度 | 机制 | 本质 |
|------|------|------|
| 垂直性 | 空间结晶 | 权力=高度 |
| 控制方式 | 垄断稀缺性 + 制造依赖 | 让被统治者自愿维持系统 |
| "自由" |{暴力的市场化| 混乱作为熵的扩散 |
| "择优统治" | 移动靶子的竞争 | 为了被奴役而竞争 |
| "升天" | 被同化的仪式 | 放弃自主性换取舒适 |

### 哲学启示

> "当垂直性成为唯一的想象，上升成为唯一的价值，所有问题都被简化为：是谁挡在上面。"

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
|{sessions_spawn| ✅ 可用 | 生成子 agent |
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
```

**何时使用：**
- ❌ `web_search` 工具不可用时
- 需要 JSON 格式输出
- 需要详细描述信息
- 需要通过代理访问

#### 2. 其他有用 Skills

| Skill | 位置 | 用途 |
|-------|------|------|
| VeADK-skills | `skills/veadk-go-skills/`, `skills/veadk-skills/` | VeADK Agent 生成 |
| coding-agent | `~/.nvm/versions/node/v22.22.0/lib/node_modules/openclaw/skills/coding-agent/` | 委托编码任务到 Codex/Claude Code/Pi |
| find-skills | `~/.openclaw/workspace/skills/find-skills/` | 帮助用户发现和安装技能 |
| humanizer-zh | `~/.openclaw/workspace/skills/Humanizer-zh/` | 去除文本中的 AI 生成痕迹（中文）|
| duckdb-en | `~/.openclaw/workspace/skills/duckdb-cli-ai-skills/` | DuckDB SQL 分析、数据处理、文件转换 |
| image-generate | `~/.openclaw/workspace/skills/image-generate/` | 使用内置脚本生成图片 |
| video-generate | `~/.openclaw/workspace/skills/video-generate/` | 使用脚本生成视频 |
| web-perf | `~/.openclaw/workspace/skills/web-perf/` | 分析网页性能（Core Web Vitals）|
| cyber-security-engineer | `~/.openclaw/workspace/skills/cyber-security-engineer/` | 安全工程工作流 |
| database-operations | `~/.openclaw/workspace/skills/database-operations/` | 数据库设计、迁移、优化 |
| sql-toolkit | `~/.openclaw/workspace/skills/sql-toolkit/` | SQL 数据库查询和设计 |
| tmux | `~/.nvm/versions/node/v22.22.0/lib/node_modules/openclaw/skills/tmux/` | 远程控制 tmux 会话 |
| weather | `~/.nvm/versions/node/v22.22.0/lib/node_modules/openclaw/skills/weather/` | 获取天气和预报 |
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

**每次会：**
1. 读取 MEMORY.md（包含此章节）
2. 查看 `web_search` 工具状态
3. 优先使用 `brave-search` skill 进行网络搜索

**关键要点：**
- ✅ brave-search 是可靠的搜索方案（已测试通过）
- ✅ skills 目录是我的工具库，不要只依赖内置工具
- ✅ 当工具失败时，主动查找 skill 替代方案
- ❌ 不要等待用户提醒才去查找 skills

---

**最后更新：** 2026-03-05
**优化内容：**
- 删除 2026-02-15/2026-02-16 过时内容（会话管理规则、Bot 日志看板、素子配置、聊天室说明）
- 压缩 2026-02-27 ~ 2026-03-02 统计详情为"累计统计"
- 保留核心哲学探索和长期参考内容
