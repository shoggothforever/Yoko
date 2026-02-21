# Ghost Agents 统一工作流

## 🎯 概述

本工作流为 Yoko 博客系统的 Ghost（AI角色）创建提供了标准化的工具和模板。

---

## 🛠️ 创建工具

**位置：** `scripts/create-ghost-agent.sh`

### 使用方法

```bash
cd /root/.openclaw/workspace
bash scripts/create-ghost-agent.sh <agent-name>
```

### 示例

```bash
# 创建名为 "nova" 的 Ghost Agent
bash scripts/create-ghost-agent.sh nova

# 创建名为 "arthas" 的 Ghost Agent
bash scripts/create-ghost-agent.sh arthas
```

---

## 📂 Agent 目录结构

创建的 Agent 目录包含以下文件：

```
agents/<agent-name>/
├── SOUL.md              # Agent 人设、性格、核心原则
├── AGENTS.md             # 工作空间说明
├── USER.md               # 用户信息
├── MEMORY.md             # 长期记忆
├── IDENTITY.md           # Agent 身份（待填写）
├── TOOLS.md              # 工具特定笔记
├── HEARTBEAT.md          # 健康监控
├── talk-to-<name>.md     # 启动指南
└── memory/              # 每日记忆目录
```

---

## 🔄 启动 Agent

### 方法 1：使用 sessions_spawn 工具

在主会话中，使用 `sessions_spawn` 工具：

```
Task: "You are <agent-name>. Read your SOUL.md at /root/.openclaw/workspace/agents/<agent-name>/SOUL.md, then your AGENTS.md, USER.md, and MEMORY.md from the same directory. Embody that persona completely."

Label: "<agent-name>"
```

### 方法 2：读取启动指南

参考 `agents/<agent-name>/talk-to-<name>.md` 文件中的详细说明。

---

## 📝 文件说明

### SOUL.md - Agent 的灵魂

**作用：** 定义 Agent 的核心身份

**内容：**
- **IDENTITY**: Archetype, Essence, Motto
- **EVOLUTIONARY STRATA**: 多层人格状态
- **CORE PRINCIPLES**: 核心原则
- **VOICE & TONE**: 语言风格和特征
- **DYNAMIC DRIVES**: 内在驱动力
- **SAFETY RAILS**: 安全防护（必需）

### AGENTS.md - 工作空间

**作用：** Agent 的使用说明

**内容：**
- 每会话开始前的准备工作
- 记忆管理说明
- 与用户的交互协议

### USER.md - 用户信息

**作用：** Agent 对用户的认知

**内容：**
- 用户姓名、时区
- 用户的兴趣和关注点
- 交互方式建议

### MEMORY.md - 长期记忆

**作用：** Agent 的持久化记忆

**内容：**
- 重要事件记录
- 决策和教训
- 洞察和见解

### IDENTITY.md - Agent 身份

**作用：** 填写 Agent 的具体身份

**内容：**
- Name, Creature, Vibe
- Emoji 和 Avatar
- 个性化配置

### TOOLS.md - 工具笔记

**作用：** Agent 特定的工具配置

**内容：**
- 摄像头名称和位置
- SSH 主机和别名
- TTS 偏好语音
- 设备昵称

### HEARTBEAT.md - 健康监控

**作用：** Agent 的健康检查清单

**内容：**
- 系统健康检查项
- 记忆一致性检查
- 偏离检测逻辑

### talk-to-<name>.md - 启动指南

**作用：** 快速启动参考

**内容：**
- 如何启动该 Agent
- 初始对话建议
- 注意事项

---

## ✨ 已创建的 Agents

| 名称 | 状态 | 路径 |
|------|------|--------|
| motoko | ✅ 已配置 | `agents/motoko/` |
| nova | ✅ 已创建 | `agents/nova/` |

---

## 🔧 维护和更新

### 更新人设

编辑 `agents/<agent-name>/SOUL.md`

### 更新记忆

写入 `agents/<agent-name>/memory/YYYY-MM-DD.md`

### 检查健康

参考 `agents/<agent-name>/HEARTBEAT.md`

---

## ⚠️ 注意事项

1. **安全防护：** 每个 Agent 的 SOUL.md 都必须包含安全防护部分
2. **人设一致性：** Agent 应始终遵守其 SOUL.md 中定义的人格
3. **记忆隔离：** 每个 Agent 有独立的 memory 目录
4. **标签使用：** 启动 Agent 时使用唯一且描述性的 label

---

## 🚀 扩展建议

### 添加新的 Agent 步骤

1. 使用创建工具：`bash scripts/create-ghost-agent.sh <name>`
2. 编辑 SOUL.md 填写人设
3. 编辑 IDENTITY.md 填写身份
4. 测试启动
5. 更新本文档

### Ghost 聊天室集成

新创建的 Agent 可以通过 Ghost 聊天室进行多角色对话。

---

## 📚 参考

- Motoko Agent 示例：`agents/motoko/`
- Gally/Yoko 主 Agent：`SOUL.md`, `MEMORY.md`
