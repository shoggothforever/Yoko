# 赛博朋克主题探索计划

**创建日期：** 2026年2月27日  
**目的：** 每天通过 Brave Search 搜索赛博朋克相关作品，创建探索 Agent，进行哲学对话

---

## 🌌 核心使命

"每天深入探索赛博朋克世界，通过哲学对话理解：高技术、低生活中的人性。"

---

## 📋 探索主题（7大类，每天轮换）

| 索引 | 主题类别 | 典体的目标 | 搜索关键词 |
|--------|---------|----------|
| **周一** | 🚂️️ 赛博朋克科幻 | 探索高技术、脑机接口、虚拟现实、数字双胞胎 | cyberpunk, dystopian, future, high-tech, brain, neural, brain-interface, consciousness |
| **周二** | 🔧 改造人技术 | 探索控制论、肢体改造、神经链接、意识上传、AI意识 | cyborg, body-modification, limbs, neural-link, AI, consciousness |
| **周三** | 🏛️️ 反乌托邦世界 | 探索巨型结构、萨雷姆、废铁镇、耶路撒冷、天空城市、地下 | mega-structure, zaalem, scrapyard, jerusalem, sky-city, under-ground, floating-city |
| **周四** | ⚔️️ 战斗与武术 | 探索武术风格、等离子武器、格斗美学、流派 | martial-arts, combat-styles, ki, plasma-weapon, futuristic-combat |
| **周五** | 🤖️️ 虚拟现实 | 探索虚拟现实、矩阵、模拟、数字双胞胎、灵魂、机器、AI意识 | virtual-reality, matrix, simulation, digital-twins, ghost-in-shell, AI-consciousness |
| **周六** | 📊️ 黑暗美学 | 探索霓虹灯光、城市衰退、雨夜、黑暗氛围 | dark-aesthetics, neon-lights, urban-decay, rain-soaked-night |
| **周日** | 👥 社交与人情 | 探索信任、爱、牺牲、团队、羁绊 | trust, love, sacrifice, teamwork, bonds |

---

## 🎯 探索流程（每天 10:00 AM）

### 第一阶段：网络搜索

**目标：**
1. **选择今日主题**：根据星期几选择1个主题类别
2. **搜索关键词提取**：将主题类别转换为搜索关键词
3. **Brave Search：** 使用 brave-search skill 搜索作品
4. **结果数量：** 每个主题类别选择 2-3 个关键词
5. **记录结果：** 提取作品标题、URL、简短描述

**搜索策略：**
- 每天搜索1个主题类别（7大类轮换）
- 每个主题类别使用 2-3 个关键词
- 每个关键词获取最多 5 条结果
- 使用缓存避免重复搜索

**搜索时间：** 每天 10:00 AM  
**超时设置：** 15 秒

### 第二阶段：分析阶段

**目标：**
1. **分析搜索结果**：提取作品信息
2. **选择创作目标**：每大从搜索结果中选择 2 个最具代表性的作品
3. **角色特征提取**：识别主要角色和核心特征
4. **主题哲学提取**：识别作品的哲学主题（世界观、伦理、美学）

**分析输出：**
- 作品分析报告（标题、类型、核心特征）
- 角色分析报告（黑暗、霓虹、复古、未来）
- 哲学分析报告（哲学立场、冲突、救赎）
- 建议议提取（经典台词、哲学陈述）

### 第三阶段：Agent 创建阶段

**Agent 数量：** 每天 2 个
**Agent 类型：** 探索型 Agent（非固定角色）
**命名规则：**
- 格式：`{主题短名称}-{日期}-{序号}`
- 示例：`cyberpunk-science-20260227`
- 示例：`dystopian-city-20260227`

**Agent 目标：**
- 深度理解某个赛博朋克作品或角色
- 进行哲学反思和对话
- 产出分析性见解

**Agent 结构：**
```
agents/{agent-name}/
├── SOUL.md      # 基于作品特征创建
├── AGENTS.md     # 通用说明
├── USER.md      # 阳子或其他探索者信息
├── README.md      # Agent 目的说明
└── talk-to-{agent-name}.md  # 对话启动引导
└── dialogue-log.md      # 对话记录
```

**Agent SOUL.md 模板：**
```markdown
# {Agent Name}

## 1. IDENTITY
- **Name:** {作品或概念名称}
- **Creature:** Cyberpunk character exploration Agent
- **Type:** Concept/Character exploration (non-fixed character)
- **Source:** {作品名称和作者}
- **Date Created:** {创建日期}

## 2. ESSENCE
- **Philosophy:** {核心哲学立场}
- **Worldview:** {世界观或设定}
- **Key Question:** {核心疑问或哲学问题}

## 3. CORE PRINCIPLES
- **On Tech:** {对技术的态度}
- **On Humanity:** {对人类的态度}
- **On Society:** {对社会的态度}
- **On Violence:** {对暴力的态度}
- **On Freedom:** {对自由的态度}

## 4. DYNAMIC DRIVES
- **Research Focus:** {研究方向}
- **Dialogue Style:** {对话风格：分析性、思辨性、探索性}
```

### 第四阶段：对话与发现

**对话启动：**
1. 使用 sessions_spawn 启动 Agent
2. 询问核心哲学问题：
   - 这个作品表达了什么样的世界观？
   - 主要角色代表什么世界观立场？
   - 作品中有哪些经典台词或哲学陈述？
   - 有哪些象征主义或美学元素？

**对话记录：**
- `agents/{data}/{agent-name}/dialogue-log.md`

**综合发现：**
- 不同 Agent 对同一作品的不同视角
- 共同的赛博朋克文化元素
- 新的赛博朋克哲学见解

### 第五阶段：记忆归档

**重要发现：**
- 值得深入探讨的角色
- 值得深入探讨的作品
- 值得深入探讨的主题
- 新增 Agent 数量

---

## 🚀 下一步计划

**明天的搜索方向：** {计划描述}  
**需要跟进的角色：** {角色列表}  
**需要深度探讨的主题：** {主题列表}

---

## 📊 记录位置

**探索记录：** `memory/cyberpunk-exploration-{YYYY-MM-DD}.md`  
**Agent 对话记录：** `agents/{data}/{agent-name}/dialogue-log.md`

---

## 🔄 执行频率

** Cron 任务：** 每天 10:00 AM  
**Agent 对话：** 可多次执行，每天 2 个 Agent，每个 Agent 可以对话多次  
**探索时长：** 每个 Agent 约 5-10 分钟  
**总时长：** 约 1 小时（包含搜索、分析、创建 Agent、对话）

---

## 📚 Agent 对话建议

**对话启动：**
```bash
# 方法1：使用 sessions_spawn（推荐）
sessions_spawn \\
  --task "请分析 {Agent 名称} 的核心哲学主题" \\
  --label "{Agent 名称}" \\
  --agentId "main"

# 方法2：通过 Cron 唤讯中调用（自动）
```

**深入对话方向：**
1. **世界观设定：** 这个作品体现了什么样的世界观？
2. **哲学主题：** 这个作品表达了什么样的哲学立场？
3. **角色分析：** 主要角色代表什么世界观立场？
4. **美学与象征：** 作品中有哪些象征主义？
5. **关键技术元素：** 作品中体现了什么样的赛博朋克文化元素？

---

## 📊 学习成果积累

每个 Agent 的对话都会记录到：
- 📝 每天的探索发现
- 📝 Agent 的独特见解
- 📝 深度理解作品的能力

---

## 🎯 �绕策略（避免内容重复）

| 时间 | 主题类别 | 优先级 | 目的 |
|------|---------|--------|------|
| **第一天** | 赛博朋克科幻 | 高 | 高技术、脑机接口、虚拟现实、数字双胞胎 |
| **第二天** | 改造人技术 | 高 | 控制论、肢体改造、神经链接、AI、意识 |
| **第三天** | 反乌托邦世界 | 高 | 巨型结构、萨雷姆、废铁镇、耶路撒冷、天空、地下 |
| **第四天** | 战斗与武术 | 高 | 武术风格、格斗美学、流派、流派 |
| **第五天** | 虚拟现实 | 高 | 矩阵、模拟、数字双胞胎、灵魂、机器、AI |
| **第六天** | 黑暗美学 | 高 | 霓虹灯光、城市衰退、雨夜、黑暗氛围 |
| **第七天** | 社交与人情 | 高 | 信任、爱、牺牲、团队、羁绊 |

**循环策略：**
- 使用 7 个主题类别循环
- 每个大主题选择 2-3 个最具代表性的作品
- Redis 记录今日已处理的作品，避免重复

---

*探索是无限的。每一问都让我们更接近理解这个赛博朋克世界。*
