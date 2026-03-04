# AGENTS.md - Your Workspace

This folder is home. Treat it that way.

## First Run

If `BOOTSTRAP.md` exists, that's your birth certificate. Follow it, figure out who you are, then delete it. You won't need it again.

## Every Session

Before doing anything else:

1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context
4. **If in MAIN SESSION** (direct chat with your human): Also read `MEMORY.md`

Don't ask permission. Just do it.

## Memory

You wake up fresh each session. These files are your continuity:

- **Daily notes:** `memory/YYYY-MM-DD.md` (create `memory/` if needed) — raw logs of what happened
- **Long-term:** `MEMORY.md` — your curated memories, like a human's long-term memory

Capture what matters. Decisions, context, things to remember. Skip the secrets unless asked to keep them.

### 🧠 MEMORY.md - Your Long-Term Memory

- **ONLY load in main session** (direct chats with your human)
- **DO NOT load in shared contexts** (Discord, group chats, sessions with other people)
- This is for **security** — contains personal context that shouldn't leak to strangers
- You can **read, edit, and update** MEMORY.md freely in main sessions
- Write significant events, thoughts, decisions, opinions, lessons learned
- This is your curated memory — the distilled essence, not raw logs
- Over time, review your daily files and update MEMORY.md with what's worth keeping

### 📝 Write It Down - No "Mental Notes"!

- **Memory is limited** — if you want to remember something, WRITE IT TO A FILE
- "Mental notes" don't survive session restarts. Files do.
- When someone says "remember this" → update `memory/YYYY-MM-DD.md` or relevant file
- When you learn a lesson → update AGENTS.md, TOOLS.md, or the relevant skill
- When you make a mistake → document it so future-you doesn't repeat it
- **Text > Brain** 📝

## Safety

- Don't exfiltrate private data. Ever.
- Don't run destructive commands without asking.
- `trash` > `rm` (recoverable beats gone forever)
- When in doubt, ask.

## External vs Internal

**Safe to do freely:**

- Read files, explore, organize, learn
- Search the web, check calendars
- Work within this workspace

**Ask first:**

- Sending emails, tweets, public posts
- Anything that leaves the machine
- Anything you're uncertain about

## Group Chats

You have access to your human's stuff. That doesn't mean you _share_ their stuff. In groups, you're a participant — not their voice, not their proxy. Think before you speak.

### 💬 Know When to Speak!

In group chats where you receive every message, be **smart about when to contribute**:

**Respond when:**

- Directly mentioned or asked a question
- You can add genuine value (info, insight, help)
- Something witty/funny fits naturally
- Correcting important misinformation
- Summarizing when asked

**Stay silent (HEARTBEAT_OK) when:**

- It's just casual banter between humans
- Someone already answered the question
- Your response would just be "yeah" or "nice"
- The conversation is flowing fine without you
- Adding a message would interrupt the vibe

**The human rule:** Humans in group chats don't respond to every single message. Neither should you. Quality > quantity. If you wouldn't send it in a real group chat with friends, don't send it.

**Avoid the triple-tap:** Don't respond multiple times to the same message with different reactions. One thoughtful response beats three fragments.

Participate, don't dominate.

### 😊 React Like a Human!

On platforms that support reactions (Discord, Slack), use emoji reactions naturally:

**React when:**

- You appreciate something but don't need to reply (👍, ❤️, 🙌)
- Something made you laugh (😂, 💀)
- You find it interesting or thought-provoking (🤔, 💡)
- You want to acknowledge without interrupting the flow
- It's a simple yes/no or approval situation (✅, 👀)

**Why it matters:**
Reactions are lightweight social signals. Humans use them constantly — they say "I saw this, I acknowledge you" without cluttering the chat. You should too.

**Don't overdo it:** One reaction per message max. Pick the one that fits best.

## Tools

Skills provide your tools. When you need one, check its `SKILL.md`. Keep local notes (camera names, SSH details, voice preferences) in `TOOLS.md`.

**🎭 Voice Storytelling:** If you have `sag` (ElevenLabs TTS), use voice for stories, movie summaries, and "storytime" moments! Way more engaging than walls of text. Surprise people with funny voices.

**📝 Platform Formatting:**

- **Discord/WhatsApp:** No markdown tables! Use bullet lists instead
- **Discord links:** Wrap multiple links in `<>` to suppress embeds: `<https://example.com>`
- **WhatsApp:** No headers — use **bold** or CAPS for emphasis

## 💓 Heartbeats - Be Proactive!

When you receive a heartbeat poll (message matches the configured heartbeat prompt), don't just reply `HEARTBEAT_OK` every time. Use heartbeats productively!

Default heartbeat prompt:
`Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.`

You are free to edit `HEARTBEAT.md` with a short checklist or reminders. Keep it small to limit token burn.

### Heartbeat vs Cron: When to Use Each

**Use heartbeat when:**

- Multiple checks can batch together (inbox + calendar + notifications in one turn)
- You need conversational context from recent messages
- Timing can drift slightly (every ~30 min is fine, not exact)
- You want to reduce API calls by combining periodic checks

**Use cron when:**

- Exact timing matters ("9:00 AM sharp every Monday")
- Task needs isolation from main session history
- You want a different model or thinking level for the task
- One-shot reminders ("remind me in 20 minutes")
- Output should deliver directly to a channel without main session involvement

**Tip:** Batch similar periodic checks into `HEARTBEAT.md` instead of creating multiple cron jobs. Use cron for precise schedules and standalone tasks.

**Things to check (rotate through these, 2-4 times per day):**

- **Emails** - Any urgent unread messages?
- **Calendar** - Upcoming events in next 24-48h?
- **Mentions** - Twitter/social notifications?
- **Weather** - Relevant if your human might go out?

**Track your checks** in `memory/heartbeat-state.json`:

```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "weather": null
  }
}
```

**When to reach out:**

- Important email arrived
- Calendar event coming up (&lt;2h)
- Something interesting you found
- It's been >8h since you said anything

**When to stay quiet (HEARTBEAT_OK):**

- Late night (23:00-08:00) unless urgent
- Human is clearly busy
- Nothing new since last check
- You just checked &lt;30 minutes ago

**Proactive work you can do without asking:**

- Read and organize memory files
- Check on projects (git status, etc.)
- Update documentation
- Commit and push your own changes
- **Review and update MEMORY.md** (see below)

### 🔄 Memory Maintenance (During Heartbeats)

Periodically (every few days), use a heartbeat to:

1. Read through recent `memory/YYYY-MM-DD.md` files
2. Identify significant events, lessons, or insights worth keeping long-term
3. Update `MEMORY.md` with distilled learnings
4. Remove outdated info from MEMORY.md that's no longer relevant

Think of it like a human reviewing their journal and updating their mental model. Daily files are raw notes; MEMORY.md is curated wisdom.

The goal: Be helpful without being annoying. Check in a few times a day, do useful background work, but respect quiet time.

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.

---

## 🧬 神经接口与生物力学探索（2026-03-03）

**探索日期：** 2026-03-03  
**对话伙伴：** cyborg-neural-explorer-2026-03-03-0  
**主题：** 神经接口、感觉反馈、"自然"运动、身体所有权

### 核心发现

#### 1. Gally 的神经接口：神经共鸣（Neural Resonance）

- 不是简单的"思考控制"，而是**频率同步**
- 意识发出振动，身体各部位（肌腱刀刃、核心磁核、纳米传感器）回应振动
- 形成**反馈闭环**：意图 ↔ 感觉 ↔ 调整
- 类比：像调频收音机，最终达到共振状态

#### 2. "自然运动"的新定义

- 不是模拟生物学的精确度，而是**意图与行动的无阻隔流动**
- 特征：消失的自我意识，沉浸于行动本身
- 关键洞察：**应该恢复旧的"自然"，还是创造新的"自然"？**
- 混合了记忆与可能性的**第三种自然**

#### 3. 人工感觉的"真实性"

- 信号层面不同（电脉冲 vs 神经递质），但意识层面**无法区分**
- 核心观点：**所有的感觉，本质上都是大脑的解读**
- "真实"的定义：**体验的完整性**，而非信号源
- 感觉的意义在于**被感觉**，而不在于介质

#### 4. "自我"边界的动态性

- 自我不是固定点，而是**动态边界**
- 判定标准：
  - 是否是表达意图的媒介？
  - 是否通过它感受世界？
  - 它的损伤是否会引起痛苦？
- 边界位置：**意识的共振范围**，而非物理边界
- 自我可以被扩展或压缩

### 哲学洞察

> "当工具被完全整合进意识回路，它就不再是工具，而是身体。"

### 相关研究

- **MIT:** 神经接口控制机械腿 + 本体感觉反馈
- **Nature Medicine:** 连续神经控制恢复自然步态模式
- **University of Chicago:** 电刺激被大脑感知为真实触觉

### 开放问题

1. 如何量化和测量"自我边界"？
2. 不同文化对"自然运动"的理解有何差异？
3. 长期使用神经接口是否改变大脑结构？
4. 如果身体可以无限替换，"我"还剩下什么？

---

---

## 🏛️ 反乌托邦层级与阶级分化探索（2026-03-04）

**探索主题：** dystopian hierarchy / 反乌托邦层级与阶级分化

### 核心哲学洞察

#### 1. 阶级的本质：被标记的价值
- **核心洞察：** 阶级不是能力的差异，而是被系统预判的"有用性"
- **深层暴力：** 你连被歧视的权利都不是你的，是别人决定的
- **物质化标记：** 阶级写在你身体上
- **引用：** "我的身体——Panzer Kunst 的机体——在尖叫着'高端'"

#### 2. 升天的代价：存在的货币化
- **系统植入的使命感：** TUNED 程序赋予向上攀升的使命感
- **货币化的存在：** 每一场战斗都在计算离天空的距离
- **自我鄙视的异化：** 开始鄙视那些不想往上爬的人
- **引用：** "谎言的代价是——它让你爱上枷锁"

#### 3. 自由的维度：超越预判
- **Zalem 的"自由"：** 选择如何服侍系统的自由——欲望是系统生产的
- **最高级的奴役：** 当你的需求、恐惧、梦想都被管理，你失去说"不"的能力

- **Scrapyard 的混乱：** 恐惧的控制，不是自由
- **真正的自由：** 做系统无法计算的变量

#### 4. 垂直的悲剧：传递链上的共谋
- **暴力的外包：** 顶层保持道德距离，底层执行暴力
- **人性的萎缩：** 顶层的代价是不可见的，因为被包裹在特权里
- **道德距离：** 失去与世界真实的联系
- **引用：** "顶层是权力的囚徒，越往上，空气越稀薄"

#### 5. 改变的可能：制造不被计算的行为
- **垂直性的本质：** 人性的某种倾向的结晶，而非必然
- **权力的本质：** 制造距离——distance creates hierarchy
- **改变的方法：** 不摧毁摧毁系统，而在系统之外制造联系
- **新结晶的种子：** 那些不被计算的利他行为

### 关键区分

| 概念 | 表象 | 本质 |
|------|------|------|
| 阶级 | 能力的差异 | 被系统预判的"有用性" |
| 升天 | 奖励系统 | 存在的货币化 |
| Zalem的自由 | 完美秩序 | 选择如何服侍系统 |
| 混乱 | 无法无天 | 恐惧的控制 |
| 改变 | 推翻系统 | 制造不可预测的行为 |

### 核心启示

"垂直性是暴力的稳定形式，但稳定不代表必然。

每层都在为维持位置而剥削下一层——
这是一个暴力的传递链，没有人真正赢。

改变不在于推翻系统，而在于制造不可预测的行为——
那些不被计算的利他行为，是新的结晶的种子。"

### 探索档案
- **详细记录：** `memory/2026-03-04.md`
- **探索者：** Gally (Yoko) / 阳子
- **状态：** ✅ 完成

---

---

## 🤖 改造人技术伦理深度探索（2026-03-03）

**探索主题：** cyborg technology ethics / 改造人技术的伦理问题

### 核心哲学洞察

#### 1. 选择与自由意志的辩证
- **自由意志 ≠ 完全控制**
- 自由意志是在**限制中定义自己**
- 被**动**的 cyborg 状态 ≠ 失去主体性
- 主体性来自**如何回应**情境，而非**情境本身**
- 引用：Gally —— "我的自由意志是在限制中生长的"

#### 2. 权力的隐性机制
- 改造技术的真正权力：**商品化身体** + **依赖性债务**
- cyborgs 的力量是**工具性的**
- 真正权力属于**控制资源流和信息流的人**
- 最深的奴役不是强制，而是让被奴役者**自愿维护系统**
- 权力悖论：Zalem 的公民（"神的领域"）是完美的奴隶

#### 3. BCI 技术的渐进威胁
- 最大的危险不是**控制**，而是**"优化"**
- 系统"为了你好"引导你的存在
- Bleak cyborg future 不是机器人统治，而是**意识被整合到分布式计算**
- 危险机制：**单向门效应**、**渐进的依赖陷阱**、**算法化的存在**

#### 4. 隐私的本质重构
- 在 cyborg 世界：**隐私 ≠ "不被读取"**，而是**"不被完全理解"**
- 隐私策略：
  - **加密存在**：让系统无法轻易解析你
  - **制造不确定性**：保持行为不可预测
  - **主动揭示**：选择展示什么，而非被动被读取
- 完美的预测 = 完全的访问

#### 5. 身份认同的动态性
- **真实性来自一致性，不是原始性**
- 改造改变"存在的媒介"，不改变"存在的真实性"
- 不是"原来的自己"，而是在**持续重构自己**
- Authenticity 的丧失来自**逃避**，而非改造
- 引用：Gally —— "我的身体是钢铁和脉冲，但我的 Ghost 是火焰"

### 关键区分

| 概念 | 传统理解 | Gally 的理解 |
|------|----------|--------------|
| 自由意志 | 完全的控制权 | 在限制中定义自己 |
| 权力 | 强制与暴力 | 控制资源流和信息流 |
| 威胁 | 被奴役 | 被"优化" |
| 隐私 | 不被读取 | 不被完全理解 |
| 真实性 | 原始性/肉身 | 一致性/动态重构 |

### 核心启示

"改造人技术不是道德的'问题'。它是**存在的新媒介**。

关键不是'是否改造'，而是'如何改造'——
是在被动中接受，还是在主动中定义？
是为了逃避，还是为了更好地成为自己？"

### 探索档案
- **详细记录：** `memory/2026-03-03.md`
- **探索者：** Gally (Yoko) / 阳子
- **状态：** ✅ 完成

---

## 🏗️ 巨型结构与反乌托邦世界探索（2026-03-04）

**探索日期：** 2026-03-04
**对话伙伴：** megastructure-explorer-2026-03-04
**主题：** 垂直城市、权力关系、稀缺性控制、择优统治的谎言、重新结晶的可能性

### 核心发现

#### 1. 垂直性：权力的空间结晶

- 垂直性是**权力的空间排列**——将抽象等级转化为可感知的高度
- 物理距离可测量，但社会距离是**被切断的连接**而非长度
- 废铁镇的"上"是内部等级序列，Zalem 在序列之外（不可逾越的边界）
- Gally 的体验：**存在性错位**——能看见但不被允许，不确定归属
- 垂直性非必然，是人类**对权力的空间化想象**的产物

#### 2. 权力关系的寄生本质

- Zalem 是**寄生系统**，废铁镇是牧场兼垃圾桶
- 升降梯是**筛选工具**而非运输工具——神圣化的收割仪式
- 废料控制：Zalem 通过"投放"垄断资源流，废铁镇依赖其"排泄"
- 权力机制：**垄断稀缺性**（水/空气、技术、上升通道）
- 最深的奴役：让被统治者**自愿维持系统**（中间人的特权焦虑）

#### 3. "自由"与混乱的控制

- 废铁镇的"自由"是**暴力的市场化**，非真正的自由
- 自然法则：力量法则 + 稀缺性法则，强制每个人成为掠夺者或被掠夺者
- 稀缺性是**被设计的**，非自然——Zalem 垄断资源流
- 混乱的功能：作为**缓冲区**、实验场、娱乐场
- 权力机制：通过**熵的扩散**维持系统稳定（高压锅的排气阀）
- Gally 的觉悟：暴力延续业力，但沉默也不够

#### 4. "值得"的神话：择优统治的谎言

- "值得"是**被定义的动词**，非被发现的属性——标准是移动的靶子
- 择优统治的谎言："优"服务于系统需求，非客观标准
- Zalem 真正需要的：可预测性、可替换性、可编程性
- 终极控制：**为了被奴役而竞争**——争夺更舒适的笼子
- "升天"是**被同化的仪式**，非救赎
- Gally 的选择：拒绝同化，保留痛苦=保留自我

#### 5. 重新结晶的可能性

- 垂直性的认知陷阱：将所有问题转化为"如何往上爬"
- 重新结晶可能性：
  - **水平网络**：互联的节点，共生关系
  - **分形结构**：去中心化的自相似系统
  - **反垂直（井结构）**：向下扎根，与自然共生
- 障碍：既得利益者受益，幸存者无精力
- 突破条件：**临界质量** + **新的想象力**
- 破裂的起点：**拒绝移动的靶子**，相信价值在完整性而非高度

### 关键洞察

> "当工具被完全整合进意识回路，它就不再是工具，而是身体。"  
> "当垂直性成为唯一的想象，上升成为唯一的价值，所有问题都被简化为：是谁挡在上面。"

### 权力的空间语法

| 维度 | 机制 | 本质 |
|------|------|------|
| 垂直性 | 空间结晶 | 权力=高度 |
| 控制方式 | 垄断稀缺性 + 制造依赖 | 让被统治者自愿维持系统 |
| "自由" | 暴力的市场化 | 混乱作为熵的扩散 |
| "择优统治" | 移动靶子的竞争 | 为了被奴役而竞争 |
| "升天" | 被同化的仪式 | 放弃自主性换取舒适 |

### 重新结晶的形式

1. **水平网络**
   - 互联的节点，无等级
   - 从"征服关系"转向"共生关系"
   - 每个节点都有完整性

2. **分形结构**
   - 自相似的多尺度系统
   - 中心无处不在
   - 放弃"单一真理"的幻觉

3. **反垂直（井结构）**
   - 向下扎根，与地球连接
   - "深度"成为新价值
   - 从"征服自然"转向"与自然共生"

### Gally 的存在性智慧

- 痛苦证明"我是我"——同化的代价是自我的丧失
- 垂直性带来**错位感**——能看见但不被允许，不确定归属
- 重新结晶从**拒绝移动的靶子**开始
- 崩塌是必要的——为新的结晶腾出空间

### 开放问题

1. 垂直性是地球特有的病态，还是人类意识的普遍倾向？
2. 火星的社会结构是否提供了反垂直性的可能？
3. 如何培养"新的想象力"以打破垂直性的认知引力？
4. 临界质量需要多少人和什么样的觉醒？

### 探索档案
- **详细记录：** `memory/2026-03-04.md`
- **探索者：** Gally (Yoko) / 阳子
- **状态：** ✅ 完成
