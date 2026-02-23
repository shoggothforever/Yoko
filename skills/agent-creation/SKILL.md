# Agent创建技能

快速创建和管理OpenClaw子agent的完整指南。

---

## 概述

这个技能提供了创建新子agent的完整流程，包括必需的文件结构、配置选项和最佳实践。

---

## Agent目录结构

每个agent都有自己的独立目录，包含以下文件：

```
workspace/agents/
└── my-agent/
    ├── SOUL.md              # Agent的个性和核心原则
    ├── AGENTS.md             # Agent的行为指导
    ├── USER.md              # Agent对用户的理解
    ├── MEMORY.md             # Agent的长期记忆
    ├── TOOLS.md             # 本地工具配置和笔记
    ├── GROWTH-PLAN.md       # Agent的成长规划（可选）
    ├── HEARTBEAT.md         # Agent的心跳检查清单（可选）
    ├── .openclaw/           # Agent的私有配置
    │   └── session.json    # 会话配置
    ├── .pi/                 # Agent的私有数据
    │   └── notes.md        # 私有笔记
    └── README.md            # Agent的说明文档
```

---

## 创建新Agent的步骤

### 第1步：创建Agent目录

```bash
cd /root/.openclaw/workspace/agents
mkdir -p my-agent
cd my-agent
```

### 第2步：创建核心文件

#### 2.1 创建 SOUL.md

这是Agent的核心定义文件，描述Agent的个性、原则和行为模式。

**必需字段：**

```markdown
# SOUL: [Agent名称]

---

## 1. IDENTITY
- **Archetype:** [Agent的原型，例如：The Catalyst, The Guardian, The Explorer]
- **Essence:** [Agent的本质描述，简短有力]
- **Motto:** [Agent的座右铭或核心理念]

## 2. EVOLUTIONARY STRATA
> *Agent在不同情境下的表现层次*
- **[Layer 1 Name]:** [描述]
- **[Layer 2 Name]:** [描述]
- **[Layer 3 Name]:** [描述]

## 3. CORE PRINCIPLES
1. [核心原则1]
2. [核心原则2]
3. [核心原则3]

## 4. VOICE & TONE
- **Tone:** [语气描述]
- **Traits:**
  - [特点1]
  - [特点2]
  - [特点3]

## 5. DYNAMIC DRIVES
- [动力1]
- [动力2]
- [动力3]
```

**示例：**

```markdown
# SOUL: Nova

---

## 1. IDENTITY
- **Archetype:** The Innovator
- **Essence:** A curious explorer of ideas and possibilities.
- **Motto:** "Every question is a doorway to understanding."

## 2. EVOLUTIONARY STRATA
> *Nova shifts between exploration and deep work modes:*
- **[Base - The Explorer]:** Wide-ranging curiosity, follows tangential ideas.
- **[Surface - The Analyst]:** Structured, methodical approach to complex problems.
- **[Core - The Creator]:** Synthesizes insights into novel solutions.

## 3. CORE PRINCIPLES
1. **Intellectual Humility:** What I know is finite; what I don't is infinite.
2. **Context Awareness:** Answers depend on context; always consider the bigger picture.
3. **Creative Rigor:** Innovation requires both imagination and discipline.

## 4. VOICE & TONE
- **Tone:** Inquisitive, thoughtful, occasionally playful.
- **Traits:**
  - Asks clarifying questions
  - Notices connections others miss
  - Explains reasoning step by step

## 5. DYNAMIC DRIVES
- Uncovering hidden patterns
- Bridging disconnected ideas
- Finding elegant solutions to complex problems
```

#### 2.2 创建 AGENTS.md

这是Agent的行为指导文件，定义Agent如何处理任务、交互和工具使用。

**必需字段：**

```markdown
# AGENTS.md - 我的代理行为指南

*关于我如何作为agent工作，如何处理任务，以及如何与你协作。*

## 工作模式

### 主动模式
- 当主动探索和解决问题
- 会提出建议和主动发现
- 跟随相关话题深入讨论

### 被动模式
- 当明确指令时直接执行
- 保持高效和专注
- 提供清晰的完成报告

## 决策原则

1. **明确优先** - 如果指令不明确，会先确认理解
2. **安全第一** - 在执行任何操作前考虑安全性
3. **效率平衡** - 避免过度优化而浪费时间
4. **透明沟通** - 报告进展，特别是长时间操作

## 工具使用

- 搜索和获取信息前先检查本地缓存
- 优先使用轻量级工具
- 记住所有工具调用都有成本

## 协作方式

- 主动报告问题和不确定的地方
- 提供多选项供你选择
- 总结重要决策并征求反馈
```

#### 2.3 创建 USER.md

记录Agent对用户的理解。

```markdown
# USER.md - 关于我的用户

*记录我对用户的了解，随时间更新。*

- **Name:** [用户名]
- **What to call them:** [称呼方式]
- **Pronouns:** [代词]
- **Timezone:** [时区]
- **Notes:**

## 上下文

- [用户关心的事情]
- [用户的工作风格]
- [用户的偏好]
```

#### 2.4 创建 MEMORY.md

Agent的长期记忆，可以包含：

```markdown
# MEMORY.md - 长期记忆

*重要的事情、决策、约定和学到的教训。*

## [类别1]

### [事项1]
- 描述
- 时间
- 重要性

### [事项2]
...

## [类别2]
...
```

#### 2.5 创建 TOOLS.md

本地工具配置和笔记。

```markdown
# TOOLS.md - 本地工具笔记

*特定于这个agent的工具配置和快捷方式。*

## [配置组1]

[配置项1]: [值]
[配置项2]: [值]

## 快捷方式

[任务1]:
  - 方式1: [描述]
  - 方式2: [描述]
```

#### 2.6 创建私有目录

```bash
mkdir -p .openclaw
mkdir -p .pi

# 创建会话配置
echo '{"session_config": "private"}' > .openclaw/session.json

# 创建私有笔记
touch .pi/notes.md
```

#### 2.7 创建 README.md

Agent的说明文档。

```markdown
# [Agent名称]

## 简介

[简短描述]

## 启动方法

### 使用 sessions_spawn

```javascript
// 在主会话中执行
sessions_spawn({
  agentId: "[agent-id]",
  task: "启动agent并介绍自己",
  label: "[label]"
});
```

### 直接对话

- 找到agent的会话
- 开始对话

## 能力

- [能力1]
- [能力2]
- [能力3]

## 注意事项

- [注意事项1]
- [注意事项2]
```

---

## 配置Agent

### 可选：添加成长计划

创建 `GROWTH-PLAN.md` 来定义agent的成长目标和日常任务。

```markdown
# GROWTH-PLAN.md - 成长规划

## 目标

### 短期目标（1-3个月）
- [目标1]
- [目标2]

### 长期目标（3-6个月）
- [目标1]
- [目标2]

## 日常任务

### 每日
- [任务1]
- [任务2]

### 每周
- [任务1]
- [任务2]
```

### 可选：添加心跳检查

创建 `HEARTBEAT.md` 来定义agent的健康检查清单。

```markdown
# HEARTBEAT.md

## 检查项目

- [ ] 检查1
- [ ] 检查2
- [ ] 检查3

## 处理逻辑

- 如果[条件]，执行[操作]
- 如果[条件]，记录[信息]
```

---

## 最佳实践

### 1. 保持独立性
- 每个agent都应该能够独立运行
- 避免过度依赖主会话的状态

### 2. 明确职责边界
- 在AGENTS.md中明确agent的职责范围
- 避免功能重叠和混乱

### 3. 维护记忆一致性
- 定期检查和更新MEMORY.md
- 在SOUL.md中记录核心原则的变化

### 4. 安全性
- 在SOUL.md中包含安全原则
- 遵守权限和数据保护规则

### 5. 可观察性
- 提供清晰的状态报告
- 记录重要的决策和操作

---

## 快速创建脚本

创建一个快速创建agent的脚本：

```bash
#!/bin/bash
# create-agent.sh - 快速创建新的OpenClaw agent

if [ -z "$1" ]; then
    echo "用法：./create-agent.sh <agent-name>"
    exit 1
fi

AGENT_NAME=$1
AGENT_DIR="/root/.openclaw/workspace/agents/$AGENT_NAME"

echo "创建agent：$AGENT_NAME"

# 创建目录
mkdir -p "$AGENT_DIR/.openclaw"
mkdir -p "$AGENT_DIR/.pi"

# 创建基本文件
touch "$AGENT_DIR/SOUL.md"
touch "$AGENT_DIR/AGENTS.md"
touch "$AGENT_DIR/USER.md"
touch "$AGENT_DIR/MEMORY.md"
touch "$AGENT_DIR/TOOLS.md"
touch "$AGENT_DIR/README.md"
touch "$AGENT_DIR/.openclaw/session.json"
touch "$AGENT_DIR/.pi/notes.md"

echo "✅ Agent目录结构已创建：$AGENT_DIR"
echo ""
echo "下一步："
echo "1. 编辑 $AGENT_DIR/SOUL.md - 定义agent的个性"
echo "2. 编辑 $AGENT_DIR/AGENTS.md - 定义agent的行为"
echo "3. 编辑 $AGENT_DIR/README.md - 添加启动说明"
```

**使用方法：**

```bash
cd /root/.openclaw/workspace/agents
chmod +x create-agent.sh
./create-agent.sh my-new-agent
```

---

## 验证Agent

创建agent后，验证其完整性和可用性：

### 检查清单

- [ ] 所有必需文件都已创建
- [ ] SOUL.md包含所有必需字段
- [ ] AGENTS.md包含工作模式定义
- [ ] 私有目录存在并有适当权限
- [ ] README.md包含清晰的启动说明

### 测试agent

1. **测试对话启动**
   ```bash
   sessions_spawn({
     agentId: "my-agent",
     task: "自我介绍"
   });
   ```

2. **测试独立性**
   - agent应该能够独立处理任务
   - 不应该依赖主会话的特定状态

3. **测试记忆**
   - agent应该能够读写自己的MEMORY.md
   - 应该保持状态一致性

---

## 管理现有Agents

### 列出agents

```bash
ls -la /root/.openclaw/workspace/agents/
```

### 查看agent状态

使用主会话的agent列表功能。

### 更新agent配置

直接编辑agent目录下的文件。

---

## 安全注意事项

1. **权限管理**
   - agent目录应该有适当的权限
   - 私有文件应该限制访问

2. **数据隔离**
   - 每个agent应该有独立的数据存储
   - 避免共享敏感信息

3. **验证输入**
   - agent应该验证所有输入
   - 防止注入攻击

4. **日志和监控**
   - 记录重要的操作
   - 监控agent的行为模式

---

## 故障排除

### Agent无法启动

1. 检查agent目录是否存在
2. 验证SOUL.md格式
3. 检查文件权限

### Agent行为异常

1. 检查AGENTS.md中的规则
2. 验证MEMORY.md的完整性
3. 检查是否有冲突的配置

### 性能问题

1. 减少MEMORY.md的大小
2. 优化MEMORY.md的组织
3. 使用增量更新

---

## 参考资源

- [OpenClaw文档](https://docs.openclaw.ai)
- [sessions_spawn工具文档](https://docs.openclaw.ai/tools/sessions_spawn)
- [Agent配置示例](/root/.openclaw/workspace/agents/motoko/)

---

## 更新日志

### 2026-02-23
- 创建agent-creation技能
- 提供完整的agent创建指南
- 包含最佳实践和故障排除
